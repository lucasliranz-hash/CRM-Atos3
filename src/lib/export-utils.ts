import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'

export async function generatePDFReport(
  elementId: string,
  userName: string,
  companyLogo?: string | null,
) {
  try {
    const element = document.getElementById(elementId)
    if (!element) return

    element.classList.add('pdf-print-mode')
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })
    const imgData = canvas.toDataURL('image/png')
    element.classList.remove('pdf-print-mode')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.setFontSize(10)
    pdf.setTextColor(100)
    pdf.text(`Relatório Executivo CRM ATOS3`, 10, 10)
    pdf.text(
      `Gerado por: ${userName} | Data: ${new Date().toLocaleString()}`,
      10,
      16,
    )

    if (companyLogo) {
      try {
        pdf.addImage(companyLogo, 'PNG', pdfWidth - 40, 5, 30, 10)
      } catch (e) {
        // Ignora erro da imagem
      }
    }

    pdf.addImage(imgData, 'PNG', 0, 25, pdfWidth, pdfHeight)
    pdf.save(`relatorio_crm_${new Date().getTime()}.pdf`)
  } catch (err) {
    console.error('Erro ao gerar PDF', err)
    alert('Erro ao gerar PDF. Verifique o console para mais detalhes.')
  }
}

export function exportExcelReport(tables: any) {
  try {
    const wb = XLSX.utils.book_new()

    const leadsWs = XLSX.utils.json_to_sheet(
      tables.leads.map((l: any) => ({
        Empresa: l.companyName,
        Contato: l.contactName || l.name,
        Telefone: l.phone,
        Email: l.email,
        Etapa: l.pipelineStage,
        Status: l.status,
        Origem: l.source,
        Data: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '',
      })),
    )
    XLSX.utils.book_append_sheet(wb, leadsWs, 'Leads')

    const proposalsWs = XLSX.utils.json_to_sheet(
      tables.proposals.map((p: any) => ({
        Numero: p.proposalNumber,
        Empresa: p.companyName,
        Status: p.status,
        Mensalidade: p.totalMonthly,
        Setup: p.totalSetup,
        DataEnvio: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString()
          : '',
      })),
    )
    XLSX.utils.book_append_sheet(wb, proposalsWs, 'Propostas')

    const activitiesWs = XLSX.utils.json_to_sheet(
      tables.activities.map((a: any) => ({
        Tipo: a.type,
        Data: a.date ? new Date(a.date).toLocaleDateString() : '',
        Status: a.completed ? 'Concluída' : 'Pendente',
        Resultado: a.result || '',
      })),
    )
    XLSX.utils.book_append_sheet(wb, activitiesWs, 'Atividades')

    XLSX.writeFile(wb, `exportacao_crm_${new Date().getTime()}.xlsx`)
  } catch (err) {
    console.error('Erro ao exportar Excel', err)
    alert('Erro ao exportar Excel. Verifique o console para mais detalhes.')
  }
}
