export function getActionColor(date?: string | null, completed?: boolean) {
  if (completed) return 'text-gray-400 border-gray-200 bg-gray-50'
  if (!date) return 'text-gray-500 border-gray-200 bg-gray-100'

  const d = new Date(date)
  const t = new Date()
  d.setHours(0, 0, 0, 0)
  t.setHours(0, 0, 0, 0)

  if (d < t) return 'text-red-600 border-red-200 bg-red-50/50 font-bold'
  if (d.getTime() === t.getTime())
    return 'text-orange-600 border-orange-200 bg-orange-50/50 font-bold'
  return 'text-black border-gray-300 bg-white font-medium'
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
  return 'bg-gray-50 text-gray-700 border-gray-200'
}

export function isGanhoOrCustomer(account: any): boolean {
  if (!account) return false
  const status = (account.status || '').toLowerCase().trim()
  const pipelineStage = (account.pipelineStage || '').toLowerCase().trim()
  return (
    status === 'ganho' ||
    status === 'cliente' ||
    status === 'customer' ||
    (status === 'fechado' && pipelineStage === 'fechado')
  )
}

export function isLostLead(account: any): boolean {
  if (!account) return false
  const status = (account.status || '').toLowerCase().trim()
  const pipelineStage = (account.pipelineStage || '').toLowerCase().trim()
  return status === 'perdido' || pipelineStage === 'perdido'
}

export function isActiveLead(account: any): boolean {
  return !isGanhoOrCustomer(account) && !isLostLead(account)
}

export function pipelineStageToStatus(stage: string): string {
  const statusMap: Record<string, string> = {
    Fechado: 'Ganho',
    Perdido: 'Perdido',
  }
  return statusMap[stage] || stage
}

export function parseCurrencyInput(
  value: string | number | null | undefined,
): number {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return value

  let cleanStr = String(value).replace(/[^\d.,-]/g, '')
  if (cleanStr.includes('.') && cleanStr.includes(',')) {
    if (cleanStr.lastIndexOf(',') > cleanStr.lastIndexOf('.')) {
      cleanStr = cleanStr.replace(/\./g, '').replace(',', '.')
    } else {
      cleanStr = cleanStr.replace(/,/g, '')
    }
  } else if (cleanStr.includes(',')) {
    cleanStr = cleanStr.replace(',', '.')
  }
  return Number(cleanStr) || 0
}
