import { CheckCircle2, Zap, Settings, Shield, TrendingDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/crm-utils'

export function PricingNextSteps({ account, config }: any) {
  const fleet = account?.fleetEstimate || 1
  const totalMonthly = fleet * config.unit

  return (
    <>
      <section className="space-y-8 break-inside-avoid pt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            04. Nossos Diferenciais
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            'Treinamento presencial com instrutor especializado',
            'Treinamento teórico e prático para todos os motoristas',
            'Acompanhamento próximo e guiado na implantação',
            'Time de suporte técnico ativo e preventivo',
            'Relatórios de performance consultivos a cada 90 dias',
          ].map((diff, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 text-black mt-0.5" />
              <span className="font-bold text-gray-800">{diff}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 break-inside-avoid pt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            05. Benefícios Esperados
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: TrendingDown, label: 'Redução de Custos Operacionais' },
            { icon: Shield, label: 'Redução Drástica de Acidentes' },
            { icon: Zap, label: 'Maior Segurança e Controle' },
            { icon: Settings, label: 'Gestão Baseada em Dados Reais' },
          ].map((ben, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-xl"
            >
              <ben.icon className="w-10 h-10 mb-4 text-black" />
              <span className="font-bold text-sm leading-tight">
                {ben.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 break-inside-avoid pt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            06. Investimento
          </h2>
          <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
            Dimensionamento financeiro para a frota estimada de{' '}
            <span className="font-black text-black">{fleet} veículos</span>.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="font-black text-black py-4 text-xs uppercase tracking-widest">
                  Item
                </TableHead>
                <TableHead className="font-black text-black py-4 text-xs uppercase tracking-widest text-right">
                  Valor
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              <TableRow>
                <TableCell className="py-6 font-bold text-base text-gray-800">
                  Mensalidade por Veículo (Unitário)
                </TableCell>
                <TableCell className="py-6 text-right font-black text-xl text-black">
                  {formatCurrency(config.unit)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-black hover:bg-black text-white">
                <TableCell className="py-6 font-bold text-base text-white">
                  Mensalidade Total da Frota ({fleet} un.)
                </TableCell>
                <TableCell className="py-6 text-right font-black text-2xl text-white">
                  {formatCurrency(totalMonthly)}
                  <span className="text-sm font-medium text-gray-400 block mt-1">
                    / mês
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-6 font-bold text-base text-gray-800">
                  Taxa de Implantação e Setup
                </TableCell>
                <TableCell className="py-6 text-right font-black text-xl text-black">
                  {formatCurrency(config.setup)}
                  <span className="text-sm font-medium text-gray-500 block mt-1">
                    pagamento único
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-8 break-inside-avoid pt-12 border-t border-gray-200 mt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            07. Workflow de Implantação
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {[
            {
              num: '1',
              title: 'Aprovação',
              desc: 'Assinatura digital e validação comercial.',
            },
            {
              num: '2',
              title: 'Implantação',
              desc: 'Instalação física dos equipamentos na frota.',
            },
            {
              num: '3',
              title: 'Treinamento',
              desc: 'Capacitação da equipe de gestão e motoristas.',
            },
            {
              num: '4',
              title: 'Go-Live',
              desc: 'Início da operação com acompanhamento.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-6 relative flex flex-col"
            >
              <div className="text-3xl font-black text-gray-300 mb-3">
                {step.num}
              </div>
              <h4 className="font-bold text-black mb-1 text-sm uppercase tracking-wider">
                {step.title}
              </h4>
              <p className="text-sm text-gray-600 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
