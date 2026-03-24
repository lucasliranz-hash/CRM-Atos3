import { useSearchParams } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { CoverSummary } from '@/components/proposal/CoverSummary'
import { ProblemSolution } from '@/components/proposal/ProblemSolution'
import { PricingNextSteps } from '@/components/proposal/PricingNextSteps'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'

export default function Proposal() {
  const [searchParams] = useSearchParams()
  const accountId = searchParams.get('accountId')
  const telemetry = searchParams.get('telemetry') === 'true'
  const video = searchParams.get('video') === 'true'
  const ai = searchParams.get('ai') === 'true'
  const unit = Number(searchParams.get('unit')) || 150
  const setup = Number(searchParams.get('setup')) || 1000

  const { accounts } = useMainStore()
  const account = accounts.find((a) => a.id === accountId) || {
    id: 'mock',
    name: 'Empresa Exemplo S/A',
    segment: 'Transporte e Logística',
    fleetEstimate: 20,
    status: 'Novo',
    priority: 'A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const config = { telemetry, video, ai, unit, setup }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0 font-sans">
      <div className="max-w-4xl mx-auto mb-8 print:hidden flex justify-between items-center px-4 md:px-0">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="font-bold bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <Button
          onClick={() => window.print()}
          className="font-bold bg-black text-white rounded-lg shadow-md hover:bg-gray-800"
        >
          <Printer className="w-4 h-4 mr-2" /> Exportar PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-16 sm:space-y-24 p-8 sm:p-16 bg-white text-black shadow-2xl print:shadow-none print:p-0">
        <CoverSummary account={account} config={config} />
        <ProblemSolution account={account} config={config} />
        <PricingNextSteps account={account} config={config} />
      </div>
    </div>
  )
}
