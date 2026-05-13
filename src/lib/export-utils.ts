export const exportExcelReport = (tables: any) => {
  let html =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>'

  if (tables.leads?.length) {
    html +=
      '<h2>Leads</h2><table border="1"><tr><th>Empresa</th><th>Contato</th><th>Telefone</th><th>Cidade</th><th>Segmento</th><th>Etapa</th><th>Status</th></tr>'
    tables.leads.forEach((l: any) => {
      html += `<tr><td>${l.companyName || l.name || ''}</td><td>${l.contactName || '-'}</td><td>${l.phone || '-'}</td><td>${l.city || '-'}</td><td>${l.segment || '-'}</td><td>${l.pipelineStage || '-'}</td><td>${l.status || '-'}</td></tr>`
    })
    html += '</table><br/>'
  }

  if (tables.proposals?.length) {
    html +=
      '<h2>Propostas</h2><table border="1"><tr><th>Número</th><th>Empresa</th><th>Mensalidade</th><th>Setup</th><th>Status</th></tr>'
    tables.proposals.forEach((p: any) => {
      html += `<tr><td>${p.proposalNumber || '-'}</td><td>${p.companyName || '-'}</td><td>${p.totalMonthly || 0}</td><td>${p.totalSetup || 0}</td><td>${p.status || '-'}</td></tr>`
    })
    html += '</table><br/>'
  }

  if (tables.activities?.length) {
    html +=
      '<h2>Atividades</h2><table border="1"><tr><th>Data</th><th>Tipo</th><th>Canal</th><th>Resultado</th><th>Concluída</th></tr>'
    tables.activities.forEach((a: any) => {
      html += `<tr><td>${new Date(a.date).toLocaleString('pt-BR')}</td><td>${a.type || '-'}</td><td>${a.channel || '-'}</td><td>${a.result || '-'}</td><td>${a.completed ? 'Sim' : 'Não'}</td></tr>`
    })
    html += '</table><br/>'
  }

  html += '</body></html>'

  const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Relatorio_Comercial_${new Date().toISOString().split('T')[0]}.xls`
  a.click()
}

export const generatePDFReport = async (
  elementId: string,
  userName: string,
  logoUrl: string | null,
) => {
  window.print()
}
