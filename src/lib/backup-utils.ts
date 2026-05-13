import { supabase } from '@/lib/supabase/client'

export const exportCompleteBackup = async (prefix = 'crm_backup') => {
  const { data: accounts } = await supabase.from('accounts').select('*')
  const { data: contacts } = await supabase.from('contacts').select('*')
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
  const { data: activities } = await supabase.from('activities').select('*')
  const { data: proposals } = await supabase.from('proposals').select('*')
  const { data: lead_actions } = await supabase.from('audit_logs').select('*')
  const { data: monthly_goals } = await supabase
    .from('monthly_goals')
    .select('*')
  const { data: profiles } = await supabase.from('profiles').select('*')
  const { data: company_settings } = await supabase
    .from('company_settings')
    .select('*')
  const { data: user_integrations } = await supabase
    .from('user_integrations')
    .select('*')

  const backupData = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    accounts: accounts || [],
    contacts: contacts || [],
    opportunities: opportunities || [],
    activities: activities || [],
    proposals: proposals || [],
    lead_actions: lead_actions || [],
    audit_logs: lead_actions || [],
    monthly_goals: monthly_goals || [],
    profiles: profiles || [],
    company_settings: company_settings || [],
    user_integrations: user_integrations || [],
  }

  const jsonString = JSON.stringify(backupData, null, 2)

  const blob = new Blob([jsonString], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${prefix}_${Date.now()}.json`
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
