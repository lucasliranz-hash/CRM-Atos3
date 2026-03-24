import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CoverSummary() {
  return (
    <>
      <section className="min-h-[80vh] flex flex-col justify-center relative">
        <div className="absolute top-0 left-0 w-full flex justify-between items-center py-6 border-b border-gray-200">
          <div className="font-black text-2xl tracking-tighter">Atos3 CRM</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Proposta Comercial
          </div>
        </div>

        <div className="space-y-8 mt-20">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1]">
            Proposta
            <br />
            Comercial
            <br />
            <span className="text-gray-300">Atos3 CRM</span>
          </h1>
          <p className="text-2xl sm:text-3xl text-gray-500 font-medium max-w-2xl leading-tight">
            Seu Sistema Operacional de Vendas B2B
          </p>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-200 pt-12">
          <div className="space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">
              Para
            </h3>
            <div className="space-y-2">
              <p className="text-xl font-bold">[Nome Empresa]</p>
              <p className="text-gray-600">A/C: [Contato]</p>
              <p className="text-gray-600">Data: [Data]</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">
              De
            </h3>
            <div className="space-y-2">
              <p className="text-xl font-bold">Atos3 CRM</p>
              <p className="text-gray-600">
                Execução Comercial Simples e Eficaz
              </p>
              <p className="text-gray-600">[Website Placeholder]</p>
              <p className="text-gray-600">[Email Placeholder]</p>
              <p className="text-gray-600">[Telefone Placeholder]</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            01. Sumário Executivo
          </h2>
          <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
            A Atos3 CRM resolve o caos da prospecção solo: cadastre leads em
            segundos, acompanhe follow-ups automaticamente, priorize ações
            diárias e transforme listas frias em oportunidades reais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            'Geração de leads rápida e organizada',
            'Follow-up anti-esquecimento com alertas visuais',
            'Pipeline visual simples (Kanban + tabela)',
            'Dashboard diário: "O que fazer hoje?"',
            'Mobile responsivo para uso em campo',
            'Import/export de listas',
          ].map((benefit, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100"
            >
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
              <span className="font-bold text-lg">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="bg-black text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xl font-medium">
            Invista R$ <span className="font-black">[preço mensal]</span> e
            ganhe 10x mais eficiência comercial.
          </p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 font-bold shrink-0"
          >
            Avançar <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </>
  )
}
