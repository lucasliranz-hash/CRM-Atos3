export function getActionColor(date?: string | null, completed?: boolean) {
  if (completed) return 'bg-green-100 text-green-800 border-green-200'
  if (!date) return 'bg-gray-100 text-gray-800 border-gray-200'

  const d = new Date(date)
  const t = new Date()
  d.setHours(0, 0, 0, 0)
  t.setHours(0, 0, 0, 0)

  if (d < t) return 'bg-red-100 text-red-800 border-red-200'
  if (d.getTime() === t.getTime())
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-blue-100 text-blue-800 border-blue-200'
}

export function isOverdue(date?: string, completed?: boolean) {
  if (!date || completed) return false
  const d = new Date(date)
  const t = new Date()
  d.setHours(0, 0, 0, 0)
  t.setHours(0, 0, 0, 0)
  return d < t
}

export function isToday(date?: string, completed?: boolean) {
  if (!date || completed) return false
  const d = new Date(date)
  const t = new Date()
  d.setHours(0, 0, 0, 0)
  t.setHours(0, 0, 0, 0)
  return d.getTime() === t.getTime()
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    Novo: 'bg-blue-50 text-blue-700',
    'Em pesquisa': 'bg-purple-50 text-purple-700',
    'Pronto para contato': 'bg-indigo-50 text-indigo-700',
    'Em prospecção': 'bg-yellow-50 text-yellow-700',
    Qualificado: 'bg-green-50 text-green-700',
    'Aguardando retorno': 'bg-orange-50 text-orange-700',
    'Sem fit': 'bg-gray-100 text-gray-600',
    Perdido: 'bg-red-50 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}
