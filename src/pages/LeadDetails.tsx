import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Edit2, Save, FileText, Plus, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/crm-utils'
import { cn } from '@/lib/utils'

export default function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    getLeadById,
    updateLead,
    deleteLeadCascade,
    addProposalToLead,
    proposals,
  } = useMainStore()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [leadData, setLeadData] = useState<any>(null)
  const [isProposalOpen, setIsProposalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      const lead = getLeadById(id)
      if (lead) setLeadData(lead)
    }
  }, [id, getLeadById])

  if (!leadData) {
    return (
      <div className="p-10 text-center text-slate-500 font-medium">
        Lead não encontrado.
      </div>
    )
  }

  const handleSave = () => {
    updateLead(leadData.id, leadData)
    setIsEditing(false)
    toast({ title: 'Lead atualizado com sucesso!' })
  }

  const handleDelete = () => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir este lead? Essa ação removerá também atividades, propostas e contatos vinculados.',
      )
    ) {
      deleteLeadCascade(leadData.id)
      toast({ title: 'Lead excluído com sucesso!' })
      navigate('/pipeline')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setLeadData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleCreateProposal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addProposalToLead({
      accountId: leadData.id,
      companyName: leadData.name,
      contactName: leadData.contactName,
      phone: leadData.phone,
      email: leadData.email,
      vehicleQuantity: Number(fd.get('vehicleQuantity')),
      value: Number(fd.get('value')),
      details: fd.get('details'),
    })
    setIsProposalOpen(false)
    toast({ title: 'Proposta criada com sucesso!' })
  }

  const leadProposals = proposals.filter(
    (p: any) => p.accountId === leadData.id,
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/pipeline')}
          className="text-slate-500 hover:text-slate-900 font-bold -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Pipeline
        </Button>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="font-bold"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Editar Lead
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="font-bold"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6">
              Informações do Lead
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Empresa
                </label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={leadData.name || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="font-semibold text-slate-900">
                    {leadData.name}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Contato
                </label>
                {isEditing ? (
                  <Input
                    name="contactName"
                    value={leadData.contactName || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="font-semibold text-slate-900">
                    {leadData.contactName || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Telefone
                </label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={leadData.phone || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="font-semibold text-slate-900">
                    {leadData.phone || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  E-mail
                </label>
                {isEditing ? (
                  <Input
                    name="email"
                    value={leadData.email || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="font-semibold text-slate-900">
                    {leadData.email || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Cidade
                </label>
                {isEditing ? (
                  <Input
                    name="city"
                    value={leadData.city || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="font-semibold text-slate-900">
                    {leadData.city || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Estado
                </label>
                {isEditing ? (
                  <Input
                    name="state"
                    value={leadData.state || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="font-semibold text-slate-900">
                    {leadData.state || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Estágio
                </label>
                {isEditing ? (
                  <Input
                    name="pipelineStage"
                    value={leadData.pipelineStage || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {leadData.pipelineStage || 'Prospecção'}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Observações
              </label>
              {isEditing ? (
                <Textarea
                  name="notes"
                  value={leadData.notes || ''}
                  onChange={handleChange}
                  className="h-24 resize-none"
                />
              ) : (
                <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap min-h-[6rem]">
                  {leadData.notes || 'Nenhuma observação.'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#FF6A00]/10 text-[#FF6A00] rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-black text-lg text-slate-900 mb-2">
              Propostas
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              Gere e acompanhe as propostas deste lead.
            </p>
            <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
              <Button
                onClick={() => navigate(`/proposals/new?leadId=${leadData.id}`)}
                className="w-full bg-[#FF6A00] hover:bg-[#e65c00] text-white font-bold h-11 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Criar Proposta
              </Button>
              <DialogContent className="hidden"></DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
            <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
              <h4 className="font-bold text-slate-900 text-sm">
                Histórico de Propostas
              </h4>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              {leadProposals.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4 font-medium">
                  Nenhuma proposta criada.
                </p>
              ) : (
                leadProposals.map((prop: any) => {
                  const val =
                    prop.value ||
                    prop.totalSetup + prop.totalEquipment + prop.totalMonthly ||
                    0
                  return (
                    <div
                      key={prop.id}
                      onClick={() => navigate(`/proposals/${prop.id}`)}
                      className="p-3 border border-slate-100 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          {prop.proposalNumber || 'PRO-000'}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded',
                            prop.status === 'Enviada'
                              ? 'bg-orange-50 text-orange-600'
                              : prop.status === 'Aprovada'
                                ? 'bg-emerald-50 text-emerald-600'
                                : prop.status === 'Recusada'
                                  ? 'bg-red-50 text-red-600'
                                  : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          {prop.status || 'Rascunho'}
                        </span>
                      </div>
                      <div className="text-sm font-black text-[#FF6A00] mb-1.5">
                        {formatCurrency(val)}
                      </div>
                      <div className="text-xs text-slate-500 font-medium flex justify-between">
                        <span>{prop.vehicleQuantity || 0} veículos</span>
                        <span>
                          {new Date(prop.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
