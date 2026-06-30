import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Download, FileText, Lightbulb } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import useMainStore from '@/stores/main'
import { useReportsData, DateRange } from '@/hooks/use-reports-data'
import { ReportsKPIs } from '@/components/reports/reports-kpis'
import { ReportsCharts } from '@/components/reports/reports-charts'
import { ReportsTables } from '@/components/reports/reports-tables'
import {
  generatePDFReport,
  exportExcelReport,
  exportLeadsToExcel,
} from '@/lib/export-utils'

export default function Reports() {
  const { user } = useAuth()
  const { logoUrl, accounts } = useMainStore() as any

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    return (localStorage.getItem('crm_report_date') as DateRange) || 'month'
  })

  const [stageFilter, setStageFilter] = useState(() => {
    return localStorage.getItem('crm_report_stage') || 'all'
  })

  const updateDateRange = (v: DateRange) => {
    setDateRange(v)
    localStorage.setItem('crm_report_date', v)
  }

  const updateStageFilter = (v: string) => {
    setStageFilter(v)
    localStorage.setItem('crm_report_stage', v)
  }

  const data = useReportsData({
    dateRange,
    responsible: 'all',
    segment: 'all',
    stage: stageFilter,
  })

  const handleExportPDF = () => {
    generatePDFReport(
      'report-content',
      user?.user_metadata?.nome || user?.email || 'Usuário',
      logoUrl,
    )
  }

  const handleExportExcel = () => {
    exportExcelReport(data.tables)
  }

  const handleExportLeadsExcel = () => {
    let filtered = accounts || []
    if (stageFilter !== 'all') {
      filtered = filtered.filter(
        (a: any) =>
          (a.pipelineStage || a.status || 'Prospecção') === stageFilter,
      )
    }
    exportLeadsToExcel(filtered)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dashboard & Performance
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Visão gerencial e relatórios de inteligência comercial
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={stageFilter} onValueChange={updateStageFilter}>
            <SelectTrigger className="w-[160px] bg-white border-slate-200">
              <SelectValue placeholder="Etapa do Funil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Etapas</SelectItem>
              <SelectItem value="Prospecção">Prospecção</SelectItem>
              <SelectItem value="Contato realizado">
                Contato realizado
              </SelectItem>
              <SelectItem value="Proposta enviada">Proposta enviada</SelectItem>
              <SelectItem value="Negociação">Negociação</SelectItem>
              <SelectItem value="Fechado">Fechado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={updateDateRange}>
            <SelectTrigger className="w-[140px] bg-white border-slate-200">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
              <SelectItem value="all">Todo o Período</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleExportLeadsExcel}
            className="bg-white text-green-600 border-slate-200 hover:text-green-700 hover:bg-green-50 font-bold"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Leads Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel Relatório
          </Button>
          <Button
            onClick={handleExportPDF}
            className="bg-[#0D1B2A] text-white hover:bg-[#1B263B] border-transparent"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {data.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {data.insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border bg-blue-50/80 border-blue-200 flex items-start gap-3 shadow-sm"
            >
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-black text-blue-900 tracking-tight">
                  Insight Automático
                </h4>
                <p className="text-sm font-medium text-blue-800 mt-1">
                  {insight}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-content, #report-content * { visibility: visible; }
          #report-content { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div
        id="report-content"
        className="space-y-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none"
      >
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            Relatório Executivo Comercial
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Filtros Aplicados:{' '}
            {dateRange === 'all' ? 'Todo o período' : dateRange} | Etapa:{' '}
            {stageFilter === 'all' ? 'Todas' : stageFilter}
          </p>
        </div>

        <ReportsKPIs kpis={data.kpis} />
        <ReportsCharts charts={data.charts} />
        <ReportsTables tables={data.tables} />
      </div>
    </div>
  )
}
