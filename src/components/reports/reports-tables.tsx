import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/crm-utils'

export function ReportsTables({ tables }: { tables: any }) {
  return (
    <div className="space-y-6">
      <Card className="rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black text-slate-800">
            Últimos Leads (Filtrados)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-bold text-slate-700">
                    Empresa / Lead
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Contato
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Etapa
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.leads.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-500 py-8"
                    >
                      Nenhum lead encontrado.
                    </TableCell>
                  </TableRow>
                )}
                {tables.leads.slice(0, 10).map((l: any) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {l.companyName}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {l.contactName || l.name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {l.pipelineStage}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">{l.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black text-slate-800">
            Últimas Propostas (Filtradas)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-bold text-slate-700">
                    Número
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Empresa
                  </TableHead>
                  <TableHead className="font-bold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-700">
                    MRR
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.proposals.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-500 py-8"
                    >
                      Nenhuma proposta encontrada.
                    </TableCell>
                  </TableRow>
                )}
                {tables.proposals.slice(0, 10).map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {p.proposalNumber}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {p.companyName}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency(p.totalMonthly || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
