import { Phone, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function PricingNextSteps() {
  return (
    <>
      {/* Section 6: Pricing */}
      <section className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            05. Precificação
          </h2>
          <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
            Atos3 é 70% mais simples e 50% mais barato para solo. Sem letras
            miúdas, sem surpresas.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="font-black text-black py-6 text-sm uppercase tracking-widest">
                  Pacote
                </TableHead>
                <TableHead className="font-black text-black py-6 text-sm uppercase tracking-widest">
                  Setup Inicial
                </TableHead>
                <TableHead className="font-black text-black py-6 text-sm uppercase tracking-widest">
                  Mensalidade
                </TableHead>
                <TableHead className="font-black text-black py-6 text-sm uppercase tracking-widest">
                  Recursos Incluídos
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              <TableRow className="hover:bg-transparent">
                <TableCell className="py-6">
                  <div className="font-black text-xl text-black">Essencial</div>
                </TableCell>
                <TableCell className="py-6 font-medium text-gray-600">
                  R$ 0<br />
                  <span className="text-xs text-gray-400">
                    (teste 14 dias grátis)
                  </span>
                </TableCell>
                <TableCell className="py-6 font-black text-xl text-black">
                  R$ 97
                  <span className="text-sm font-medium text-gray-500">
                    /mês
                  </span>
                </TableCell>
                <TableCell className="py-6 font-medium text-gray-600">
                  Leads, Contatos, Atividades básicas
                </TableCell>
              </TableRow>
              <TableRow className="bg-black hover:bg-black text-white">
                <TableCell className="py-6">
                  <div className="font-black text-xl flex items-center gap-2">
                    Pro
                    <span className="bg-white text-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded font-bold">
                      Recomendado
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-6 font-medium text-gray-300">
                  R$ 497
                  <br />
                  <span className="text-xs text-gray-400">
                    (setup + treinamento)
                  </span>
                </TableCell>
                <TableCell className="py-6 font-black text-xl text-white">
                  R$ 297
                  <span className="text-sm font-medium text-gray-400">
                    /mês
                  </span>
                </TableCell>
                <TableCell className="py-6 font-medium text-gray-300">
                  + Pipeline, Dashboard, Automação follow-up
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-transparent">
                <TableCell className="py-6">
                  <div className="font-black text-xl text-black">
                    Enterprise
                  </div>
                </TableCell>
                <TableCell className="py-6 font-medium text-gray-600">
                  Sob consulta
                </TableCell>
                <TableCell className="py-6 font-black text-xl text-black">
                  R$ 497
                  <span className="text-sm font-medium text-gray-500">
                    /mês
                  </span>
                </TableCell>
                <TableCell className="py-6 font-medium text-gray-600">
                  + Customizações, Suporte prioritário
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center text-sm font-bold text-gray-500">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" /> 20% OFF no plano
            anual
          </span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" /> Sem fidelidade
            mínima
          </span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" /> Cancele quando
            quiser
          </span>
        </div>
      </section>

      {/* Section 7: Próximos Passos */}
      <section className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            06. Próximos Passos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              num: '1',
              title: 'Aprovação',
              desc: 'Assinatura digital da proposta.',
            },
            {
              num: '2',
              title: 'Kickoff',
              desc: 'Reunião de 30 min para alinhamento.',
            },
            {
              num: '3',
              title: 'Setup',
              desc: '1 dia para configuração e treinamento.',
            },
            { num: '4', title: 'Go-Live', desc: 'Sistema operando em 48h.' },
            {
              num: '5',
              title: 'Suporte',
              desc: 'Acompanhamento nos primeiros 30 dias.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative flex flex-col"
            >
              <div className="text-4xl font-black text-gray-200 mb-4">
                {step.num}
              </div>
              <h4 className="font-bold text-black mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-black text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Pronto para começar?</h3>
            <p className="text-gray-400 font-medium">
              Assine agora e comece a gerar leads amanhã.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 font-bold shrink-0 text-lg h-14 px-8 rounded-xl"
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
          >
            <Phone className="mr-2 w-5 h-5" /> Falar no WhatsApp
          </Button>
        </div>
      </section>

      {/* Section 8: Anexos */}
      <section className="space-y-8 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-black tracking-tight border-b-2 border-black inline-block pb-1">
          07. Anexos & Termos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-medium text-gray-600">
          <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="font-bold text-black uppercase tracking-widest text-xs">
              Especificações Técnicas (SLA)
            </h4>
            <p>
              Garantimos 99.9% de uptime para a plataforma. Manutenções
              programadas serão comunicadas com 48h de antecedência e realizadas
              fora do horário comercial (22h - 06h BRT).
            </p>
            <p>
              Backups automáticos diários em servidores distribuídos, garantindo
              a integridade total dos seus leads e contatos.
            </p>
          </div>
          <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h4 className="font-bold text-black uppercase tracking-widest text-xs">
              Termos Gerais
            </h4>
            <p>
              Os valores apresentados nesta proposta são válidos por 15 dias a
              partir da data de emissão.
            </p>
            <p>
              Pagamentos via PIX ou Cartão de Crédito. Notas fiscais emitidas no
              dia 1º de cada mês referente ao período de utilização. Sem taxa de
              cancelamento mediante aviso prévio de 15 dias.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
