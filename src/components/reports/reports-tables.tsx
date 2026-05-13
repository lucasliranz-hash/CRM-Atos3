import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/crm-utils'

export function ReportsTables({ tables }: { tables: any }) {
  if (!tables) return null

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-700">
            Últimas Propostas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Número</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Mensalidade</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Setup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tables.proposals?.slice(0, 5).map((p: any) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {p.proposalNumber || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.companyName || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                        {p.status || 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">
                      {formatCurrency(p.totalMonthly || 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(p.totalSetup || 0)}
                    </td>
                  </tr>
                ))}
                {(!tables.proposals || tables.proposals.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Nenhuma proposta no período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-700">
            Últimos Leads (Prospecção)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Empresa</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Etapa</th>
                  <th className="px-4 py-3">Próx. Ação</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tables.leads?.slice(0, 5).map((l: any) => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {l.companyName || l.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {l.contactName || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold">
                        {l.pipelineStage || 'Prospecção'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {l.nextAction || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 text-xs">
                      {new Date(l.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
                {(!tables.leads || tables.leads.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Nenhum lead no período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
