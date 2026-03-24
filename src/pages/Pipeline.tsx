import { useState } from 'react'
import useMainStore from '@/stores/main'
import { formatCurrency } from '@/lib/crm-utils'
import { Badge } from '@/components/ui/badge'
import { Building2, List, Trello } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { ProposalGeneratorDialog } from '@/components/proposal/ProposalGeneratorDialog'

const STAGES = [
  'Diagnóstico',
  'Reunião agendada',
  'Reunião realizada',
  'Piloto',
  'Proposta',
  'Negociação',
  'Fechado ganho',
  'Fechado perdido',
]

export default function Pipeline() {
  const { opportunities, accounts, updateOpportunityStage } = useMainStore()
  const { toast } = useToast()
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [selectedOpp, setSelectedOpp] = useState<any>(null)
  const [proposalAccountId, setProposalAccountId] = useState<string | null>(
    null,
  )

  const handleUpdateStage = (e: any) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const stage = fd.get('stage') as any
    const lossReason = fd.get('lossReason') as string

    if (stage === 'Fechado perdido' && !lossReason) {
      toast({
        title: 'Atenção',
        description: 'Motivo de perda é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    updateOpportunityStage(selectedOpp.id, stage, lossReason)
    setSelectedOpp(null)
    toast({ title: 'Fase atualizada' })
  }

  return (
    <div className="space-y-6 h-full flex flex-col max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Pipeline de Vendas</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Gestão de oportunidades ativas
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('kanban')}
            className={`rounded font-bold h-8 px-4 ${view === 'kanban' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            <Trello className="w-4 h-4 mr-2" /> Kanban
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('table')}
            className={`rounded font-bold h-8 px-4 ${view === 'table' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
          >
            <List className="w-4 h-4 mr-2" /> Lista
          </Button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-2">
          {STAGES.map((stage) => {
            const opps = opportunities.filter((o) => o.stage === stage)
            const stageTotal = opps.reduce((sum, o) => sum + o.total, 0)
            return (
              <div
                key={stage}
                className="min-w-[320px] w-[320px] flex flex-col bg-gray-50/80 rounded-xl p-3 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-sm text-black uppercase tracking-wider">
                    {stage}{' '}
                    <Badge
                      variant="secondary"
                      className="ml-1 bg-white border border-gray-200"
                    >
                      {opps.length}
                    </Badge>
                  </h3>
                  <span className="text-xs font-bold text-gray-500">
                    {formatCurrency(stageTotal)}
                  </span>
                </div>
                <div className="space-y-3">
                  {opps.map((opp) => {
                    const acc = accounts.find((a) => a.id === opp.accountId)
                    return (
                      <div
                        key={opp.id}
                        onClick={() => setSelectedOpp(opp)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors group"
                      >
                        <div className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 group-hover:text-black transition-colors">
                          <Building2 className="w-3 h-3" />
                          {acc?.name}
                        </div>
                        <h4 className="font-black text-sm text-black mb-3">
                          {opp.name}
                        </h4>
                        <div className="flex justify-between items-center">
                          <div className="font-black text-black">
                            {formatCurrency(opp.total)}
                          </div>
                          <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {opp.probability}% WIN
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {opps.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold text-black">
                  Oportunidade
                </TableHead>
                <TableHead className="font-bold text-black">Conta</TableHead>
                <TableHead className="font-bold text-black">Fase</TableHead>
                <TableHead className="font-bold text-black">
                  Valor Total
                </TableHead>
                <TableHead className="font-bold text-black text-right">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opp) => {
                const acc = accounts.find((a) => a.id === opp.accountId)
                return (
                  <TableRow key={opp.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-bold text-sm text-black">
                      {opp.name}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-700">
                      {acc?.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-gray-300 font-bold rounded"
                      >
                        {opp.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-black">
                      {formatCurrency(opp.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedOpp(opp)}
                        className="h-8 text-xs font-bold rounded hover:bg-gray-100"
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedOpp && (
        <Dialog open={!!selectedOpp} onOpenChange={() => setSelectedOpp(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Atualizar Oportunidade</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateStage} className="space-y-4 mt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Fase Atual *
                </label>
                <select
                  name="stage"
                  defaultValue={selectedOpp.stage}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Motivo de Perda (Obrigatório se Perdido)
                </label>
                <Input
                  name="lossReason"
                  defaultValue={selectedOpp.lossReason || ''}
                  placeholder="Ex: Preço alto, Sem budget..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white font-bold mt-4"
              >
                Salvar Alteração
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 font-bold border-gray-300 text-black hover:bg-gray-100"
                onClick={() => {
                  setProposalAccountId(selectedOpp.accountId)
                  setSelectedOpp(null)
                }}
              >
                Gerar Proposta Comercial
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <ProposalGeneratorDialog
        accountId={proposalAccountId}
        open={!!proposalAccountId}
        onOpenChange={(open) => !open && setProposalAccountId(null)}
      />
    </div>
  )
}
