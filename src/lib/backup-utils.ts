import { supabase } from '@/lib/supabase/client'

export const exportCompleteBackup = async (prefix = 'crm_backup') => {
  const tables = [
    'accounts',
    'contacts',
    'opportunities',
    'activities',
    'proposals',
    'audit_logs',
    'monthly_goals',
    'company_settings',
    'profiles',
    'user_integrations',
  ]

  const backupData: Record<string, any[]> = {}

  for (const table of tables) {
    const { data } = await supabase.from(table).select('*')
    if (data) backupData[table] = data
  }

  const blob = new Blob([JSON.stringify(backupData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url

  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  const timeStr =
    now.getHours().toString().padStart(2, '0') +
    '-' +
    now.getMinutes().toString().padStart(2, '0')

  a.download = `${prefix}_${dateStr}_${timeStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return backupData
}

export const extractDataFromBackup = (parsedData: any) => {
  if (
    parsedData.data &&
    typeof parsedData.data === 'object' &&
    !Array.isArray(parsedData.data)
  ) {
    return parsedData.data
  }
  if (
    parsedData.crmData &&
    typeof parsedData.crmData === 'object' &&
    !Array.isArray(parsedData.crmData)
  ) {
    return parsedData.crmData
  }
  return parsedData
}

export const diagnoseBackup = (fileContent: string) => {
  try {
    const parsed = JSON.parse(fileContent)
    const data = extractDataFromBackup(parsed)

    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Formato de JSON desconhecido.' }
    }

    const tables = Object.keys(data).filter((k) => Array.isArray(data[k]))
    if (tables.length === 0) {
      return {
        valid: false,
        error: 'Nenhuma tabela com registros encontrada.',
      }
    }

    const report: Record<string, number> = {}

    tables.forEach((t) => {
      report[t] = data[t].length
    })

    return { valid: true, report }
  } catch (e: any) {
    return { valid: false, error: e.message || 'JSON inválido' }
  }
}

export const importBackupData = async (
  data: Record<string, any[]>,
  onProgress: (msg: string) => void,
) => {
  const stats = {
    accounts: 0,
    contacts: 0,
    opportunities: 0,
    activities: 0,
    proposals: 0,
    errors: 0,
  }

  const upsertTable = async (
    table: string,
    records: any[],
    keyName: string = 'id',
  ) => {
    if (!records || !records.length) return
    onProgress(`Importando ${table} (${records.length} registros)...`)

    const batchSize = 100
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const { error } = await supabase
        .from(table)
        .upsert(batch, { onConflict: keyName })

      if (error) {
        console.warn(
          `Erro no batch de ${table}. Tentando linha a linha...`,
          error,
        )
        for (const record of batch) {
          const { error: rowError } = await supabase
            .from(table)
            .upsert(record, { onConflict: keyName })
          if (rowError) {
            console.error(
              `Erro ao importar registro em ${table}:`,
              rowError,
              record,
            )
            stats.errors += 1
          } else {
            if (table in stats) (stats as any)[table] += 1
          }
        }
      } else {
        if (table in stats) (stats as any)[table] += batch.length
      }
    }
  }

  try {
    await upsertTable('company_settings', data.company_settings || [], 'id')
    await upsertTable('profiles', data.profiles || [], 'id')

    const accountsData = data.accounts || data.leads || []
    await upsertTable('accounts', accountsData, 'id')

    await upsertTable('contacts', data.contacts || [], 'id')
    await upsertTable(
      'opportunities',
      data.opportunities || data.pipeline || [],
      'id',
    )
    await upsertTable('proposals', data.proposals || [], 'id')
    await upsertTable('activities', data.activities || [], 'id')
    await upsertTable(
      'audit_logs',
      data.audit_logs || data.lead_actions || [],
      'id',
    )
    await upsertTable('monthly_goals', data.monthly_goals || [], 'id')
    await upsertTable('user_integrations', data.user_integrations || [], 'id')
  } catch (e: any) {
    onProgress(`Falha crítica durante importação: ${e.message}`)
    stats.errors += 1
  }

  onProgress('Importação concluída!')
  return stats
}
