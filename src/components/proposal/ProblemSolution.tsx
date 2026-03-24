import { XCircle, Video, Cpu, ActivitySquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProblemSolution({ account, config }: any) {
  const seg = (account?.segment || '').toLowerCase()

  let problems = [
    'Uso indevido dos veículos fora do horário de trabalho',
    'Altos custos com combustível e multas de trânsito',
    'Desgaste acelerado da frota por má condução',
    'Falta de dados precisos para tomada de decisão',
  ]
  if (seg.includes('transporte') || seg.includes('pesad')) {
    problems = [
      'Alto índice de acidentes e sinistros rodoviários',
      'Falta de controle sobre a jornada e comportamento do motorista',
      'Riscos relacionados a roubo de carga e desvios de rota',
      'Custos imprevisíveis com manutenção corretiva',
    ]
  } else if (seg.includes('log') || seg.includes('distribui')) {
    problems = [
      'Atrasos nas entregas e descumprimento de SLAs',
      'Falta de visibilidade em tempo real da frota',
      'Custos elevados com combustível por rotas ineficientes',
      'Dificuldade em gerenciar devoluções e paradas não programadas',
    ]
  }

  return (
    <>
      <section className="space-y-8 break-inside-avoid pt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            02. Entendimento do Cenário
          </h2>
          <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
            Com base em análises de operações similares ao seu segmento,
            mapeamos os seguintes desafios principais que comprometem a margem
            de lucro:
          </p>
        </div>

        <div className="space-y-4 bg-gray-50 p-8 rounded-2xl border border-gray-100">
          {problems.map((pain, i) => (
            <div key={i} className="flex items-start gap-4 text-gray-700">
              <XCircle className="w-6 h-6 shrink-0 text-black mt-0.5" />
              <span className="font-semibold text-lg">{pain}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 break-inside-avoid pt-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            03. Escopo da Solução
          </h2>
          <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
            Selecionamos os seguintes módulos de tecnologia para compor o
            projeto ideal para a operação da {account.name}:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.telemetry && (
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <ActivitySquare className="w-8 h-8 mb-4 text-black" />
                <CardTitle className="text-xl font-black">
                  Telemetria Avançada
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-gray-600 font-medium">
                Monitoramento em tempo real, controle de comportamento ao
                volante (aceleração, frenagem brusca e RPM) e redução direta de
                custos operacionais com combustível e manutenção.
              </CardContent>
            </Card>
          )}

          {config.video && (
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <Video className="w-8 h-8 mb-4 text-black" />
                <CardTitle className="text-xl font-black">
                  Vídeo Telemetria
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-gray-600 font-medium">
                Monitoramento contínuo de rotas, acompanhamento de processos de
                carga/descarga e gravação de eventos de risco para garantia de
                segurança operacional e jurídica.
              </CardContent>
            </Card>
          )}

          {config.ai && (
            <Card className="border-gray-200 shadow-sm rounded-xl bg-black text-white md:col-span-2">
              <CardHeader>
                <Cpu className="w-8 h-8 mb-4 text-white" />
                <CardTitle className="text-xl font-black text-white">
                  Câmera com Inteligência Artificial
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-gray-300 font-medium">
                Inteligência artificial embarcada na cabine para detecção
                automática de uso de celular, sonolência, fadiga, distração,
                falta de cinto de segurança e alertas em tempo real.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  )
}
