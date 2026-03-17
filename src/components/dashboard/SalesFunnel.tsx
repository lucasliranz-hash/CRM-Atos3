import { Expand, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLeads } from '@/contexts/LeadsContext'

export function SalesFunnel() {
  const { leads } = useLeads()

  const prospectCount = leads.filter((l) => l.status === 'Prospect').length
  const contactedCount = leads.filter((l) => l.status === 'Contacted').length
  const proposalCount = leads.filter((l) => l.status === 'Proposal Sent').length

  const totalActive = prospectCount + contactedCount + proposalCount

  return (
    <div className="glass-card p-6 rounded-[32px] h-full flex flex-col shadow-sm border border-white/60">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          Funil de Vendas (Ativos)
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
            <Expand className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-3xl font-bold text-gray-900">{totalActive}</h3>
        <p className="text-sm text-gray-500">Leads no Pipeline</p>
      </div>

      <div className="space-y-4 flex-1">
        <div className="bg-white/50 rounded-2xl p-4 relative overflow-hidden group hover:bg-white/80 transition-colors border border-gray-100">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                Prospect
              </p>
              <p className="font-bold text-gray-800 text-lg">
                {prospectCount} Leads
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              <Expand className="w-3 h-3 text-gray-600" />
            </div>
          </div>
          <div className="absolute left-0 bottom-0 h-1.5 bg-yellow-400 w-full" />
        </div>

        <div className="bg-white/50 rounded-2xl p-4 relative overflow-hidden group hover:bg-white/80 transition-colors ml-4 border border-gray-100">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                Contacted
              </p>
              <p className="font-bold text-gray-800 text-lg">
                {contactedCount} Leads
              </p>
            </div>
          </div>
          <div className="absolute left-0 bottom-0 h-1.5 bg-blue-500 w-[75%]" />
        </div>

        <div className="bg-white/50 rounded-2xl p-4 relative overflow-hidden group hover:bg-white/80 transition-colors ml-8 border border-gray-100">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                Proposal Sent
              </p>
              <p className="font-bold text-gray-800 text-lg">
                {proposalCount} Leads
              </p>
            </div>
          </div>
          <div className="absolute left-0 bottom-0 h-1.5 bg-purple-500 w-[50%]" />
        </div>
      </div>
    </div>
  )
}
