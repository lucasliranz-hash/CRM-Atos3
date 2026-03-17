import { Metrics } from '@/components/dashboard/Metrics'
import { SalesFunnel } from '@/components/dashboard/SalesFunnel'
import { RightPanel } from '@/components/dashboard/RightPanel'
import { Truck } from 'lucide-react'

export default function Index() {
  return (
    <div className="flex items-start">
      <div className="flex-1">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Dashboard de Frotas
            </h1>
            <p className="text-muted-foreground">
              Visão geral de leads e pipeline de transporte B2B
            </p>
          </div>

          <Metrics />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <SalesFunnel />

            <div className="glass-card p-8 rounded-[32px] flex flex-col justify-center items-center text-center border border-white/60 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Truck className="w-64 h-64" />
              </div>
              <div className="bg-black text-white p-4 rounded-2xl mb-6 shadow-xl relative z-10">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">
                Transport CRM
              </h3>
              <p className="text-gray-500 max-w-sm relative z-10">
                Sistema especializado para gerenciar leads, acompanhar propostas
                e fechar contratos de veículos comerciais.
              </p>
            </div>
          </div>
        </div>
      </div>
      <RightPanel />
    </div>
  )
}
