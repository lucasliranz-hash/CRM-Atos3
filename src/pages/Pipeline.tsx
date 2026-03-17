import useMainStore from '@/stores/main'
import { formatCurrency } from '@/lib/crm-utils'
import { Badge } from '@/components/ui/badge'
import { OpportunityStage } from '@/types/crm'
import { Building2 } from 'lucide-react'

const STAGES: OpportunityStage[] = [
  'Diagnóstico',
  'Reunião agendada',
  'Proposta',
  'Negociação',
  'Fechado ganho',
]

export default function Pipeline() {
  const { opportunities, accounts } = useMainStore()

  return (
    <div className="space-y-6 h-full flex flex-col min-h-[80vh]">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Pipeline de Vendas</h1>
        <p className="text-muted-foreground">
          Visualize e mova oportunidades ativas
        </p>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-2">
        {STAGES.map((stage) => {
          const opps = opportunities.filter((o) => o.stage === stage)
          const totalValue = opps.reduce((sum, o) => sum + o.total, 0)

          return (
            <div
              key={stage}
              className="min-w-[320px] w-[320px] flex flex-col bg-gray-100/50 rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">
                  {stage}{' '}
                  <Badge variant="secondary" className="ml-2 bg-white">
                    {opps.length}
                  </Badge>
                </h3>
                <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm border">
                  {formatCurrency(totalValue)}
                </span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                {opps.length === 0 ? (
                  <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">
                    Nenhuma op.
                  </div>
                ) : (
                  opps.map((opp) => {
                    const acc = accounts.find((a) => a.id === opp.accountId)
                    return (
                      <div
                        key={opp.id}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-grab group"
                      >
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                          <Building2 className="w-3 h-3" /> {acc?.name}
                        </div>
                        <h4 className="font-semibold text-sm leading-tight mb-4 text-gray-900">
                          {opp.name}
                        </h4>
                        <div className="flex justify-between items-end">
                          <span className="font-bold text-gray-900 text-sm">
                            {formatCurrency(opp.total)}
                          </span>
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-xs font-semibold">
                            {opp.probability}% win
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
