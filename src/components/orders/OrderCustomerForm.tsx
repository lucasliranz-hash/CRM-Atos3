import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderForm, Account } from '@/types/crm'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Props {
  order: Partial<OrderForm>
  onChange: (updates: Partial<OrderForm>) => void
}

export function OrderCustomerForm({ order, onChange }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    supabase
      .from('accounts')
      .select('id, name, companyName, email, phone, city, state')
      .then(({ data }) => {
        if (data) setAccounts(data)
      })
  }, [])

  const handleAccountSelect = (accountId: string) => {
    if (accountId === 'manual') {
      onChange({ is_manual_customer: true, account_id: null })
      return
    }
    const acc = accounts.find((a) => a.id === accountId)
    if (acc) {
      onChange({
        is_manual_customer: false,
        account_id: acc.id,
        customer_name: acc.name || acc.companyName,
        phone: acc.phone || '',
        email: acc.email || '',
        city: acc.city || '',
        state: acc.state || '',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Selecione o Cliente</Label>
          <Select
            value={order.is_manual_customer ? 'manual' : order.account_id || ''}
            onValueChange={handleAccountSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">
                -- Cadastrar Cliente Manualmente --
              </SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name || a.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Responsável (Vendedor)</Label>
          <Input
            value={order.responsible || ''}
            onChange={(e) => onChange({ responsible: e.target.value })}
            placeholder="Nome do responsável"
          />
        </div>
        <div className="space-y-2">
          <Label>Status do Pedido</Label>
          <Select
            value={order.status || 'Rascunho'}
            onValueChange={(v: any) => onChange({ status: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Rascunho">Rascunho</SelectItem>
              <SelectItem value="Pedido gerado">Pedido gerado</SelectItem>
              <SelectItem value="Em separação">Em separação</SelectItem>
              <SelectItem value="Entregue">Entregue</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {order.is_manual_customer && (
        <div className="space-y-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Dados do Cliente Manual</h3>
            <div className="flex items-center gap-2">
              <Switch
                checked={order.save_customer_to_crm || false}
                onCheckedChange={(c) => onChange({ save_customer_to_crm: c })}
              />
              <Label>Salvar no CRM</Label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input
                value={order.customer_name || ''}
                onChange={(e) => onChange({ customer_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                value={order.customer_cnpj || ''}
                onChange={(e) => onChange({ customer_cnpj: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Contato</Label>
              <Input
                value={order.contact_name || ''}
                onChange={(e) => onChange({ contact_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={order.phone || ''}
                onChange={(e) => onChange({ phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                value={order.email || ''}
                onChange={(e) => onChange({ email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade/Estado</Label>
              <Input
                value={order.city || ''}
                onChange={(e) => onChange({ city: e.target.value })}
              />
            </div>
            <div className="space-y-2 lg:col-span-3">
              <Label>Endereço Completo</Label>
              <Input
                value={order.address || ''}
                onChange={(e) => onChange({ address: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {!order.is_manual_customer && order.account_id && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Empresa (CRM)</Label>
            <Input
              value={order.customer_name || ''}
              readOnly
              className="bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input
              value={order.customer_cnpj || ''}
              onChange={(e) => onChange({ customer_cnpj: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
