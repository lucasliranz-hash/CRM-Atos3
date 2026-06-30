import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

export const exportLeadsToExcel = (leads: any[]) => {
  const data = leads.map((lead) => ({
    Empresa: lead.companyName || lead.name || '',
    CNPJ: lead.cnpj || '',
    Contato: lead.contactName || '',
    Telefone: lead.phone || '',
    WhatsApp: lead.whatsapp || '',
    'E-mail': lead.email || '',
    Cidade: lead.city || '',
    Estado: lead.state || '',
    Segmento: lead.segment || '',
    'Quantidade de veículos': lead.vehicleCount ?? lead.fleetEstimate ?? 0,
    'Origem do lead': lead.leadSource || lead.source || '',
    'Etapa do pipeline': lead.pipelineStage || '',
    Status: lead.status || '',
    'Próxima ação': lead.nextAction || '',
    'Data próxima ação': lead.nextActionDate
      ? new Date(lead.nextActionDate).toLocaleDateString('pt-BR')
      : '',
    Observações: lead.notes || '',
    'Criado em': lead.createdAt
      ? new Date(lead.createdAt).toLocaleDateString('pt-BR')
      : '',
    'Atualizado em': lead.updatedAt
      ? new Date(lead.updatedAt).toLocaleDateString('pt-BR')
      : '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')

  const today = new Date().toISOString().split('T')[0]
  const filename = `leads_atos3_${today}.xlsx`

  XLSX.writeFile(workbook, filename)
}

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

export const exportOrderExcel = (
  order: any,
  items: any[] = [],
  company: any = null,
) => {
  let html =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>'

  if (company) {
    html += `<h2>${company.fantasy_name || company.company_name || 'Emissor'}</h2>`
    html += `<table>
      <tr><td><b>CNPJ:</b></td><td>${company.cnpj || ''}</td></tr>
      <tr><td><b>Telefone:</b></td><td>${company.phone || ''}</td></tr>
      <tr><td><b>E-mail:</b></td><td>${company.email || ''}</td></tr>
      <tr><td><b>Endereço:</b></td><td>${company.address || ''}, ${company.number || ''} - ${company.city || ''}/${company.state || ''}</td></tr>
    </table><br/>`
  }

  html += `<h2>Ficha de Pedido - ${order.order_number || 'Novo'}</h2>`
  html += `<table>
    <tr><td><b>Data:</b></td><td>${new Date().toLocaleDateString('pt-BR')}</td></tr>
    <tr><td><b>Empresa Cliente:</b></td><td>${order.customer_name || ''}</td></tr>
    <tr><td><b>CNPJ:</b></td><td>${order.customer_cnpj || ''}</td></tr>
    <tr><td><b>Contato:</b></td><td>${order.contact_name || ''}</td></tr>
    <tr><td><b>Telefone:</b></td><td>${order.phone || ''}</td></tr>
    <tr><td><b>Responsável:</b></td><td>${order.responsible || ''}</td></tr>
  </table><br/>`

  if (items && items.length) {
    html +=
      '<table border="1"><tr><th>Produto</th><th>Descrição</th><th>Quantidade</th><th>Unidade</th><th>Valor Unitário</th><th>Total</th><th>Observação</th></tr>'
    items.forEach((i: any) => {
      html += `<tr>
        <td>${i.product_name || ''}</td>
        <td>${i.description || ''}</td>
        <td>${i.quantity || 0}</td>
        <td>${i.unit || ''}</td>
        <td>${i.unit_price || 0}</td>
        <td>${i.total_price || 0}</td>
        <td>${i.notes || ''}</td>
      </tr>`
    })
    html += '</table><br/>'
  }

  html += `<table>
    <tr><td><b>Subtotal:</b></td><td>${order.subtotal || 0}</td></tr>
    <tr><td><b>Desconto:</b></td><td>${order.discount || 0}</td></tr>
    <tr><td><b>Total Geral:</b></td><td>${order.total_amount || 0}</td></tr>
  </table>`

  html += '</body></html>'

  const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Pedido_${order.order_number || 'Novo'}.xls`
  a.click()
}

export const generatePDFReport = async (
  elementId: string,
  userName: string,
  logoUrl: string | null,
) => {
  window.print()
}

export const generateProposalPDF = async (
  elementId: string,
  filename: string,
) => {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    const noPrintElements = element.querySelectorAll('.no-print')
    noPrintElements.forEach((el) => {
      ;(el as HTMLElement).style.setProperty('display', 'none', 'important')
    })

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    noPrintElements.forEach((el) => {
      ;(el as HTMLElement).style.removeProperty('display')
    })

    const imgData = canvas.toDataURL('image/jpeg', 1.0)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgHeight = (canvas.height * pdfWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight)
    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}
