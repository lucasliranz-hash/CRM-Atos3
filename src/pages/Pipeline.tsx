import { useState } from 'react'
import useMainStore from '@/stores/main'
import { formatCurrency, isOverdue } from '@/lib/crm-utils'
import { Badge } from '@/components/ui/badge'
import { Building2, List, Trello, Plus, AlertCircle } from 'lucide-react'
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

const STAGES = [
  'Prospecção',
  'Qualificação',
  'Proposta',
  'Negociação',
  'Fechado ganho',
  'Fechado perdido',
]

export default function Pipeline() {
  const { opportunities, accounts, updateOpportunity, addOpportunity } =
    useMainStore()
  const { toast } = useToast()
  const [view, setView] = useState<'kanban' | 'table'>('kanban')
  const [selectedOpp, setSelectedOpp] = useState<any>(null)
  const [isNewOpen, setIsNewOpen] = useState(false)

  const handleUpdateStage = (e: any) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const stage = fd.get('stage') as any
    const lossReason = fd.get('lossReason') as string
    const nextAction = fd.get('nextAction') as string
    const nextActionDate = fd.get('nextActionDate') as string

    if (stage === 'Fechado perdido' && !lossReason) {
      toast({
        title: 'Atenção',
        description: 'Motivo de perda é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    updateOpportunity(selectedOpp.id, {
      stage,
      lossReason,
      nextAction,
      nextActionDate,
    })
    toast({ title: 'Oportunidade atualizada' })
    setSelectedOpp(null)
  }

  const handleCreateOpp = (e: any) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    addOpportunity({
      accountId: fd.get('accountId') as string,
      name: fd.get('name') as string,
      stage: fd.get('stage') as any,
      mrr: Number(fd.get('mrr')) || 0,
      setup: Number(fd.get('setup')) || 0,
      total: Number(fd.get('total')) || 0,
      probability: Number(fd.get('probability')) || 0,
      nextAction: fd.get('nextAction') as string,
      nextActionDate: fd.get('nextActionDate') as string,
    })
    setIsNewOpen(false)
    toast({ title: 'Oportunidade criada com sucesso!' })
  }

  const onDragStart = (e: React.DragEvent, oppId: string) => {
    e.dataTransfer.setData('oppId', oppId)
  }

  const onDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const oppId = e.dataTransfer.getData('oppId')
    if (oppId) {
      if (stage === 'Fechado perdido') {
        const opp = opportunities.find((o) => o.id === oppId)
        if (opp) {
          setSelectedOpp({ ...opp, stage })
        }
      } else {
        updateOpportunity(oppId, { stage: stage as any })
      }
    }
  }

  return (
    <div className="space-y-6 h-full flex flex-col max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight">
            Pipeline de Vendas
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Gestão visual de negociações e oportunidades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm mr-2 hidden sm:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('kanban')}
              className={`rounded font-bold h-8 px-4 ${view === 'kanban' ? 'bg-black text-white hover:bg-black hover:text-white' : 'text-gray-500 hover:text-black'}`}
            >
              <Trello className="w-4 h-4 mr-2" /> Kanban
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('table')}
              className={`rounded font-bold h-8 px-4 ${view === 'table' ? 'bg-black text-white hover:bg-black hover:text-white' : 'text-gray-500 hover:text-black'}`}
            >
              <List className="w-4 h-4 mr-2" /> Lista
            </Button>
          </div>

          <Button
            onClick={() => setIsNewOpen(true)}
            className="bg-black text-white rounded font-bold hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Oportunidade
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
                className="min-w-[320px] w-[320px] flex flex-col bg-gray-50 rounded-xl p-3 border border-gray-200"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, stage)}
              >
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="font-black text-sm text-black uppercase tracking-wider flex items-center">
                    {stage}
                    <span className="ml-2 bg-white text-gray-500 text-[10px] px-2 py-0.5 rounded-full border border-gray-200">
                      {opps.length}
                    </span>
                  </h3>
                  <span className="text-xs font-bold text-gray-500">
                    {formatCurrency(stageTotal)}
                  </span>
                </div>
                <div className="space-y-3">
                  {opps.map((opp) => {
                    const acc = accounts.find((a) => a.id === opp.accountId)
                    const overdue = opp.nextActionDate
                      ? isOverdue(opp.nextActionDate)
                      : true

                    const isNewLead =
                      opp.stage === 'Prospecção' &&
                      opp.nextAction?.includes('Contato inicial')

                    return (
                      <div
                        key={opp.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, opp.id)}
                        onClick={() => setSelectedOpp(opp)}
                        className={`bg-white p-4 rounded-xl shadow-sm border cursor-grab active:cursor-grabbing hover:border-black transition-colors group ${overdue && !isNewLead ? 'border-red-200' : isNewLead ? 'border-blue-200' : 'border-gray-200'}`}
                      >
                        <div className="text-xs font-bold text-gray-500 mb-2 flex items-center justify-between group-hover:text-black transition-colors">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {acc?.name}
                          </span>
                          <div className="flex items-center gap-1">
                            {isNewLead && (
                              <span className="bg-blue-100 text-blue-800 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                                Novo Lead
                              </span>
                            )}
                            {overdue && !isNewLead && (
                              <AlertCircle
                                className="w-3 h-3 text-red-500"
                                title="Ação atrasada ou pendente"
                              />
                            )}
                          </div>
                        </div>
                        <h4 className="font-black text-sm text-black mb-3 leading-tight">
                          {opp.name}
                        </h4>
                        <div className="flex justify-between items-center mb-3">
                          <div className="font-black text-black">
                            {formatCurrency(opp.total)}
                          </div>
                          <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                            {opp.probability}% WIN
                          </span>
                        </div>
                        <div
                          className={`text-[10px] font-semibold px-2 py-1.5 rounded bg-gray-50 border ${overdue && !isNewLead ? 'border-red-100 text-red-700' : isNewLead ? 'border-blue-100 text-blue-800 bg-blue-50/50' : 'border-gray-100 text-gray-600'}`}
                        >
                          Ação: {opp.nextAction || 'Não definida'}
                        </div>
                      </div>
                    )
                  })}
                  {opps.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 bg-white/50">
                      Solte aqui
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
                  Próxima Ação
                </TableHead>
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
                const overdue = opp.nextActionDate
                  ? isOverdue(opp.nextActionDate)
                  : true

                const isNewLead =
                  opp.stage === 'Prospecção' &&
                  opp.nextAction?.includes('Contato inicial')

                return (
                  <TableRow key={opp.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-bold text-sm text-black">
                      <div className="flex items-center gap-2">
                        {opp.name}
                        {isNewLead && (
                          <span className="bg-blue-100 text-blue-800 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                            Novo
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-700">
                      {acc?.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-gray-200 font-bold rounded bg-white"
                      >
                        {opp.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`text-xs font-semibold ${overdue && !isNewLead ? 'text-red-600' : isNewLead ? 'text-blue-600' : 'text-gray-600'}`}
                      >
                        {opp.nextAction || 'Pendente'}
                      </div>
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
                  Motivo de Perda (Se Perdido)
                </label>
                <Input
                  name="lossReason"
                  defaultValue={selectedOpp.lossReason || ''}
                  placeholder="Ex: Preço alto, Sem budget..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Próxima Ação
                  </label>
                  <Input
                    name="nextAction"
                    defaultValue={selectedOpp.nextAction || ''}
                    placeholder="Ex: Follow-up"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    Data Ação
                  </label>
                  <Input
                    name="nextActionDate"
                    type="date"
                    defaultValue={
                      selectedOpp.nextActionDate?.split('T')[0] || ''
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white font-bold mt-4"
              >
                Salvar Alteração
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Oportunidade</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOpp} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Conta *</label>
              <select
                name="accountId"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-black"
              >
                <option value="">Selecione...</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">
                Nome da Oportunidade *
              </label>
              <Input
                name="name"
                required
                placeholder="Ex: Expansão 50 veículos"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Fase *
                </label>
                <select
                  name="stage"
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
                  Valor Total (R$)
                </label>
                <Input name="total" type="number" defaultValue="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Próxima Ação *
                </label>
                <Input
                  name="nextAction"
                  required
                  placeholder="Ex: Enviar proposta"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">
                  Data Ação *
                </label>
                <Input name="nextActionDate" type="date" required />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white font-bold mt-4 hover:bg-gray-800"
            >
              Criar Oportunidade
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
