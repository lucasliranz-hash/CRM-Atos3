import { Plus, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OrderFormItem } from '@/types/crm'

interface Props {
  items: Partial<OrderFormItem>[]
  onChange: (items: Partial<OrderFormItem>[]) => void
}

export function OrderItemsTable({ items, onChange }: Props) {
  const updateItem = (index: number, updates: Partial<OrderFormItem>) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...updates }

    // Auto calculate
    const qty = Number(newItems[index].quantity || 0)
    const price = Number(newItems[index].unit_price || 0)
    newItems[index].total_price = qty * price

    onChange(newItems)
  }

  const addItem = () => {
    onChange([
      ...items,
      {
        product_name: '',
        quantity: 1,
        unit: 'Unidade',
        unit_price: 0,
        total_price: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const duplicateItem = (index: number) => {
    const itemToCopy = { ...items[index], id: undefined }
    const newItems = [...items]
    newItems.splice(index + 1, 0, itemToCopy)
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Itens do Pedido</h3>
        <Button onClick={addItem} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" /> Adicionar Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase">
              <th className="p-3 min-w-[200px]">Produto / Descrição</th>
              <th className="p-3 w-24">Qtd</th>
              <th className="p-3 w-32">Unidade</th>
              <th className="p-3 w-32">Valor Unit.</th>
              <th className="p-3 w-32">Total</th>
              <th className="p-3 min-w-[150px]">Obs</th>
              <th className="p-3 w-20 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <tr key={idx} className="group">
                <td className="p-2 space-y-2">
                  <Input
                    placeholder="Nome do produto..."
                    value={item.product_name || ''}
                    onChange={(e) =>
                      updateItem(idx, { product_name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Descrição detalhada..."
                    value={item.description || ''}
                    onChange={(e) =>
                      updateItem(idx, { description: e.target.value })
                    }
                    className="text-xs h-8"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    min="0"
                    value={item.quantity || ''}
                    onChange={(e) =>
                      updateItem(idx, { quantity: Number(e.target.value) })
                    }
                  />
                </td>
                <td className="p-2">
                  <Input
                    placeholder="Un, Kit..."
                    list="units-list"
                    value={item.unit || ''}
                    onChange={(e) => updateItem(idx, { unit: e.target.value })}
                  />
                  <datalist id="units-list">
                    <option value="Unidade" />
                    <option value="Kit" />
                    <option value="Peça" />
                    <option value="Metro" />
                    <option value="Par" />
                    <option value="Caixa" />
                    <option value="Serviço" />
                  </datalist>
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price || ''}
                    onChange={(e) =>
                      updateItem(idx, { unit_price: Number(e.target.value) })
                    }
                  />
                </td>
                <td className="p-2 font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(item.total_price || 0)}
                </td>
                <td className="p-2">
                  <Input
                    placeholder="Observação..."
                    value={item.notes || ''}
                    onChange={(e) => updateItem(idx, { notes: e.target.value })}
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400"
                      onClick={() => duplicateItem(idx)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-500"
                      onClick={() => removeItem(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Nenhum item adicionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
