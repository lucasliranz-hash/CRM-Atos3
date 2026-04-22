import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Account, Contact } from '@/types/crm'

interface ContactFormProps {
  initialData?: Contact | null
  accounts: Account[]
  onSubmit: (data: any) => void
  submitLabel: string
}

export function ContactForm({
  initialData,
  accounts,
  onSubmit,
  submitLabel,
}: ContactFormProps) {
  const [phone, setPhone] = useState(initialData?.whatsapp || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [accountId, setAccountId] = useState(initialData?.accountId || '')

  const formatPhone = (val: string) => {
    const v = val.replace(/\D/g, '').substring(0, 11)
    if (v.length >= 11)
      return `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`
    if (v.length >= 7)
      return `(${v.substring(0, 2)}) ${v.substring(2, 6)}-${v.substring(6)}`
    if (v.length >= 3) return `(${v.substring(0, 2)}) ${v.substring(2)}`
    return v
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmail(val)

    if (!initialData && val.includes('@')) {
      const domain = val.split('@')[1].toLowerCase()
      const common = [
        'gmail.com',
        'hotmail.com',
        'yahoo.com',
        'outlook.com',
        'icloud.com',
      ]
      if (!common.includes(domain) && !accountId) {
        const found = accounts.find(
          (a) =>
            a.website?.toLowerCase().includes(domain) ||
            a.name
              .toLowerCase()
              .replace(/\s/g, '')
              .includes(domain.split('.')[0]),
        )
        if (found) setAccountId(found.id)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      accountId: fd.get('accountId') as string,
      name: fd.get('name') as string,
      role: fd.get('role') as string,
      processRole: fd.get('processRole') as string,
      email: fd.get('email') as string,
      whatsapp: phone,
      linkedin: fd.get('linkedin') as string,
      isDecisionMaker: fd.get('processRole') === 'Decisor',
      isInfluencer: fd.get('processRole') === 'Influenciador',
      isChampion: fd.get('processRole') === 'Campeão',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-gray-700">Conta *</label>
          <select
            name="accountId"
            required
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
          >
            <option value="">Selecione...</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-gray-700">
            Papel no Processo *
          </label>
          <select
            name="processRole"
            required
            defaultValue={initialData?.processRole || 'Decisor'}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
          >
            <option value="Decisor">Decisor</option>
            <option value="Influenciador">Influenciador</option>
            <option value="Campeão">Campeão</option>
            <option value="Gatekeeper">Gatekeeper</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Operações">Operações</option>
          </select>
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-gray-700">Nome *</label>
          <Input
            name="name"
            required
            defaultValue={initialData?.name}
            placeholder="Nome completo"
          />
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-gray-700">Cargo</label>
          <Input
            name="role"
            defaultValue={initialData?.role}
            placeholder="Ex: CEO"
          />
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-gray-700">E-mail</label>
          <Input
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="contato@empresa.com"
          />
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold text-gray-700">WhatsApp</label>
          <Input
            name="whatsapp"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            minLength={14}
            maxLength={15}
          />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-xs font-bold text-gray-700">
            LinkedIn URL
          </label>
          <Input
            name="linkedin"
            defaultValue={initialData?.linkedin}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-black hover:bg-gray-800 text-white font-bold mt-2"
      >
        {submitLabel}
      </Button>
    </form>
  )
}
