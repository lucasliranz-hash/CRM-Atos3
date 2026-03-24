import {
  XCircle,
  ArrowRight,
  Target,
  Users,
  Activity,
  LayoutDashboard,
  BarChart3,
  DownloadCloud,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProblemSolution() {
  return (
    <>
      <section className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            02. O Problema
          </h2>
          <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
            Sem CRM adequado, você perde leads, esquece follow-ups, dispara foco
            e demora para fechar negócios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {[
              'Leads perdidos em planilhas e cadernos',
              'Sem clareza das tarefas diárias',
              'Follow-ups esquecidos ou atrasados',
              'Pipeline invisível e sem previsibilidade',
              'Métricas calculadas manualmente',
            ].map((pain, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-600">
                <XCircle className="w-5 h-5 shrink-0 text-gray-400" />
                <span className="font-medium text-lg">{pain}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <h4 className="font-black text-xl mb-8 text-center uppercase tracking-widest text-gray-400">
              Antes vs Depois
            </h4>
            <div className="flex flex-col gap-6">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center text-center opacity-50 grayscale">
                <span className="font-bold text-xl text-gray-500 mb-2">
                  CAOS (Planilhas)
                </span>
                <p className="text-sm font-medium">
                  Dados dispersos, zero alertas, vendas perdidas.
                </p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="w-8 h-8 rotate-90 lg:rotate-0" />
              </div>
              <div className="p-6 border-2 border-black rounded-xl bg-black text-white flex flex-col items-center justify-center text-center shadow-xl">
                <span className="font-black text-xl mb-2">
                  ORDEM (Atos3 CRM)
                </span>
                <p className="text-sm font-medium text-gray-300">
                  Processo centralizado, alertas diários, previsibilidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            03. A Solução
          </h2>
          <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
            CRM minimalista em preto e branco, projetado para execução comercial
            solo. Foco em leads, prospecção e follow-up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <Target className="w-8 h-8 mb-4" />
              <CardTitle className="text-lg font-black">
                Contas e Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 font-medium">
              Rapid registration, ICP qualification, Priority A/B/C, niche,
              estimated fleet.
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <Users className="w-8 h-8 mb-4" />
              <CardTitle className="text-lg font-black">Contatos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 font-medium">
              Decision makers, influencers; LinkedIn, WhatsApp, email
              integration.
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <Activity className="w-8 h-8 mb-4" />
              <CardTitle className="text-lg font-black">Atividades</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 font-medium">
              Log actions (LinkedIn, call, WA), results, auto next action +
              date.
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <LayoutDashboard className="w-8 h-8 mb-4" />
              <CardTitle className="text-lg font-black">Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 font-medium">
              Visual Kanban, stages (diagnóstico → fechado), MRR value,
              probability.
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm rounded-xl bg-black text-white">
            <CardHeader>
              <BarChart3 className="w-8 h-8 mb-4 text-white" />
              <CardTitle className="text-lg font-black text-white">
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 font-medium">
              Tasks of the day, overdue, no action, metrics (leads, meetings,
              conversions).
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm rounded-xl">
            <CardHeader>
              <DownloadCloud className="w-8 h-8 mb-4" />
              <CardTitle className="text-lg font-black">Extras</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 font-medium">
              Sheet import, filters, cadence, loss reasons, interest level.
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 border border-gray-200 rounded-2xl p-2 bg-gray-50 shadow-sm overflow-hidden">
          <div className="bg-white border border-gray-200 rounded-xl aspect-[16/9] flex flex-col relative overflow-hidden">
            <div className="h-10 border-b border-gray-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <div className="mx-auto bg-gray-100 h-4 w-48 rounded" />
            </div>
            <div className="flex-1 flex">
              <div className="w-48 border-r border-gray-100 p-4 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-4/5" />
              </div>
              <div className="flex-1 p-6 space-y-6">
                <div className="h-8 bg-black rounded w-1/3" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-gray-100 rounded-xl border border-gray-200" />
                  <div className="h-24 bg-gray-100 rounded-xl border border-gray-200" />
                  <div className="h-24 bg-gray-100 rounded-xl border border-gray-200" />
                </div>
                <div className="h-48 bg-gray-50 rounded-xl border border-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            04. Benefícios e ROI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="text-6xl font-black tracking-tighter">+300%</div>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">
              Leads Organizados
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-6xl font-black tracking-tighter">0%</div>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">
              Follow-ups Perdidos
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="text-6xl font-black tracking-tighter">1</div>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">
              Tela para Gestão
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-12 text-center space-y-6">
          <h3 className="text-2xl font-black">Estimativa de Retorno (ROI)</h3>
          <p className="text-xl font-medium text-gray-600">
            Investimento{' '}
            <span className="text-black font-black bg-gray-200 px-2 py-1 rounded">
              R$ X
            </span>
            <ArrowRight className="inline-block mx-4 w-6 h-6 align-middle" />
            Retorno{' '}
            <span className="text-black font-black bg-gray-200 px-2 py-1 rounded">
              Y oportunidades fechadas
            </span>
          </p>
        </div>

        <div className="border-l-4 border-black pl-8 py-4">
          <p className="text-2xl font-medium italic mb-4">
            "Economizei 4h/dia em organização e aumentei minhas taxas de
            conversão no primeiro mês."
          </p>
          <p className="font-bold uppercase tracking-widest text-sm text-gray-500">
            - Cliente X
          </p>
        </div>
      </section>
    </>
  )
}
