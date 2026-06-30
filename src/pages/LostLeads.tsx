import { useState, useMemo } from 'react'
import useMainStore from '@/stores/main'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, FileText, Pencil, Users as UsersIcon } from 'lucide-react'
import { LeadEditModal } from '@/components/LeadEditModal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { format } from 'date-fns'

export default function LostLeads() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { accounts, activities, fetchData } = useMainStore() as any
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [reopenId, setReopenId] = useState<string | null>(null)
  const [reopenStage, setReopenStage] = useState('Prospecção')

  const lostLeads = useMemo(
    () =>
      accounts.filter(
        (a: any) =>
          (a.status || '').toLowerCase() === 'perdido' ||
          (a.pipelineStage || '').toLowerCase() === 'perdido',
      ),
    [accounts],
  )

  const filtered = lostLeads.filter((a: any) => {
    const q = search.toLowerCase()
    return (
      (a.companyName || a.name || '').toLowerCase().includes(q) ||
      (a.contactName || '').toLowerCase().includes(q) ||
      (a.phone || '').includes(q)
    )
  })

  const getLastNote = (accountId: string) => {
    const acts = activities
      .filter((a: any) => a.accountId === accountId)
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    return acts[0]?.result || acts[0]?.description || '-'
  }

  const handleReopen = async () => {
    if (!reopenId) return
    await supabase
      .from('accounts')
      .update({
        status: reopenStage,
        pipelineStage: reopenStage,
        lossReason: null,
      })
      .eq('id', reopenId)
    await fetchData()
    toast({ title: 'Negociação reaberta com sucesso!' })
    setReopenId(null)
    window.dispatchEvent(new Event('lead_updated'))
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Leads Perdidos
        </h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">
          Oportunidades arquivadas. Reabra a qualquer momento.
        </p>
      </div>
      <Card className="rounded-[10px] border border-slate-100 shadow-sm bg-white">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-10 text-center">
              <UsersIcon className="w-12 h-12 text-slate-200 mb-3 mx-auto" />
              <p className="text-slate-500 font-medium">
                Nenhum lead perdido encontrado.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Empresa</th>
                  <th className="p-3">Contato</th>
                  <th className="p-3">Telefone</th>
                  <th className="p-3">Cidade</th>
                  <th className="p-3">Segmento</th>
                  <th className="p-3">Motivo</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Última Obs.</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a: any) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">
                      {a.companyName || a.name}
                    </td>
                    <td className="p-3 text-slate-600">
                      {a.contactName || '-'}
                    </td>
                    <td className="p-3 text-slate-600">{a.phone || '-'}</td>
                    <td className="p-3 text-slate-600">{a.city || '-'}</td>
                    <td className="p-3 text-slate-600">{a.segment || '-'}</td>
                    <td className="p-3 text-slate-600">
                      {a.lossReason || '-'}
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {a.lossDate || a.updatedAt
                        ? format(
                            new Date(a.lossDate || a.updatedAt),
                            'dd/MM/yyyy',
                          )
                        : '-'}
                    </td>
                    <td className="p-3 text-slate-500 text-xs max-w-[200px] truncate">
                      {getLastNote(a.id)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/leads/${a.id}`)}
                          title="Abrir Lead"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditId(a.id)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs font-bold h-7"
                          onClick={() => {
                            setReopenId(a.id)
                            setReopenStage('Prospecção')
                          }}
                        >
                          Reabrir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {editId && (
        <LeadEditModal
          open={!!editId}
          onOpenChange={(o: boolean) => !o && setEditId(null)}
          accountId={editId}
          onSuccess={() => fetchData()}
        />
      )}
      <Dialog open={!!reopenId} onOpenChange={(o) => !o && setReopenId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reabrir Negociação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Etapa do Pipeline
            </label>
            <Select value={reopenStage} onValueChange={setReopenStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prospecção">Prospecção</SelectItem>
                <SelectItem value="Contato realizado">
                  Contato realizado
                </SelectItem>
                <SelectItem value="Reunião agendada">
                  Reunião agendada
                </SelectItem>
                <SelectItem value="Proposta enviada">
                  Proposta enviada
                </SelectItem>
                <SelectItem value="Negociação">Negociação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setReopenId(null)}>
              Cancelar
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleReopen}
            >
              Reabrir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
