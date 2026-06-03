import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useMainStore from '@/stores/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Edit2,
  Save,
  FileText,
  Plus,
  Trash2,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Briefcase,
  CalendarClock,
  History,
  Target,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, isOverdue } from '@/lib/crm-utils'
import { cn } from '@/lib/utils'
import LeadInteractionForm from '@/components/LeadInteractionForm'
import { ManualActionModal } from '@/components/ManualActionModal'
import { LeadEditModal } from '@/components/LeadEditModal'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase/client'

export default function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    getLeadById,
    updateAccount,
    deleteLeadCascade,
    proposals,
    activities,
    orders,
    addActivity,
  } = useMainStore() as any
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [leadData, setLeadData] = useState<any>(null)
  const [isProposalOpen, setIsProposalOpen] = useState(false)

  const [fullEditModalOpen, setFullEditModalOpen] = useState(false)
  const [interactionModalOpen, setInteractionModalOpen] = useState(false)
  const [manualActionOpen, setManualActionOpen] = useState(false)
  const [interactionDefaults, setInteractionDefaults] = useState<{
    channel: any
    type: any
  }>({ channel: 'WhatsApp', type: 'Mensagem' })

  const [dbError, setDbError] = useState('')
  const [loading, setLoading] = useState(true)

  const [leadActivities, setLeadActivities] = useState<any[]>([])
  const [leadProposals, setLeadProposals] = useState<any[]>([])

  async function fetchAccount() {
    if (!id) return
    setLoading(true)
    try {
      const [accRes, actsRes, propsRes] = await Promise.all([
        supabase.from('accounts').select('*').eq('id', id).single(),
        supabase
          .from('activities')
          .select('*')
          .eq('accountId', id)
          .order('date', { ascending: false }),
        supabase
          .from('proposals')
          .select('*')
          .eq('accountId', id)
          .order('createdAt', { ascending: false }),
      ])
      if (accRes.error) throw accRes.error
      setLeadData(accRes.data)
      if (actsRes.data) setLeadActivities(actsRes.data)
      if (propsRes.data) setLeadProposals(propsRes.data)
    } catch (e: any) {
      setDbError(e.message || 'Erro desconhecido')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccount()
  }, [id])

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500 font-medium">
        Carregando detalhes...
      </div>
    )
  }

  if (!leadData) {
    return (
      <div className="p-10 max-w-2xl mx-auto mt-10">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Lead não encontrado.
          </h2>
          <div className="text-sm font-mono space-y-2 bg-white/50 p-4 rounded-lg">
            <p>
              <strong>ID na URL:</strong> {id}
            </p>
            <p>
              <strong>Tabela consultada:</strong> accounts
            </p>
            <p>
              <strong>Erro Supabase:</strong>{' '}
              {dbError ||
                'Nenhum registro retornado ou erro de permissão (RLS).'}
            </p>
          </div>
          <Button
            onClick={() => navigate('/pipeline')}
            variant="outline"
            className="mt-6 bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Pipeline
          </Button>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    await updateAccount(leadData.id, leadData)
    setIsEditing(false)
    toast({ title: 'Lead atualizado com sucesso!' })
  }

  const handleDelete = async () => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir este lead? Essa ação removerá também atividades, propostas e contatos vinculados.',
      )
    ) {
      await deleteLeadCascade(leadData.id)
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

  const openInteraction = (channel: string, type: string) => {
    setInteractionDefaults({ channel, type })
    setInteractionModalOpen(true)
  }

  const handleCompleteNextAction = async () => {
    await addActivity({
      accountId: leadData.id,
      date: new Date().toISOString(),
      channel: 'WhatsApp',
      type: 'Follow-up',
      result: `Ação Concluída: ${leadData.nextAction}`,
      completed: true,
    } as any)
    await updateAccount(leadData.id, {
      nextAction: null,
      nextActionDate: null,
    })
    toast({ title: 'Ação marcada como concluída!' })
  }

  const handleLost = async () => {
    if (window.confirm('Marcar este lead como Perdido?')) {
      await updateAccount(leadData.id, {
        pipelineStage: 'Perdido',
        status: 'Perdido',
      })
      toast({ title: 'Lead marcado como Perdido.' })
    }
  }

  const leadOrders =
    orders?.filter((o: any) => o.account_id === leadData.id) || []

  const lastActivity = leadActivities.find((a) => a.completed)
  const daysStalled = lastActivity
    ? Math.floor(
        (new Date().getTime() - new Date(lastActivity.date).getTime()) /
          (1000 * 3600 * 24),
      )
    : Math.floor(
        (new Date().getTime() - new Date(leadData.createdAt).getTime()) /
          (1000 * 3600 * 24),
      )
  const isActionOverdue = isOverdue(leadData.nextActionDate)

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
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
                className="font-bold border-slate-200"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Editar Lead
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                className="font-bold text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {leadData.name}
          </h1>
          <p className="text-slate-500 font-medium flex items-center mt-1">
            {leadData.contactName && (
              <span className="mr-2">{leadData.contactName}</span>
            )}
            {leadData.contactName && (
              <span className="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>
            )}
            <span>
              {leadData.phone || leadData.email || 'Sem contato principal'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right hidden md:block">
            <p className="text-slate-500 font-bold uppercase text-[10px]">
              Etapa do Pipeline
            </p>
            <p className="font-black text-slate-900">
              {leadData.pipelineStage || 'Prospecção'}
            </p>
          </div>
          <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
          <div className="text-right hidden md:block">
            <p className="text-slate-500 font-bold uppercase text-[10px]">
              Tempo Parado
            </p>
            <p
              className={cn(
                'font-black',
                daysStalled > 7 ? 'text-red-600' : 'text-slate-900',
              )}
            >
              {daysStalled} dias
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => openInteraction('Telefone', 'Ligação')}
          variant="outline"
          className="h-auto py-3 flex flex-col items-center gap-2 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-sm"
        >
          <Phone className="w-5 h-5" />
          <span className="font-bold text-xs">Registrar Ligação</span>
        </Button>
        <Button
          onClick={() => openInteraction('WhatsApp', 'Mensagem')}
          variant="outline"
          className="h-auto py-3 flex flex-col items-center gap-2 border-slate-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all shadow-sm"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-bold text-xs">WhatsApp</span>
        </Button>
        <Button
          onClick={() => openInteraction('Presencial', 'Reunião realizada')}
          variant="outline"
          className="h-auto py-3 flex flex-col items-center gap-2 border-slate-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all shadow-sm"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-bold text-xs">Registrar Reunião</span>
        </Button>
        <Button
          onClick={() => openInteraction('E-mail', 'Proposta enviada')}
          variant="outline"
          className="h-auto py-3 flex flex-col items-center gap-2 border-slate-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-all shadow-sm"
        >
          <FileText className="w-5 h-5" />
          <span className="font-bold text-xs">Enviar Proposta</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div
            className={cn(
              'bg-white p-6 rounded-xl border shadow-sm relative overflow-hidden',
              isActionOverdue ? 'border-red-200' : 'border-slate-200',
            )}
          >
            {isActionOverdue && (
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            )}
            {!isActionOverdue && leadData.nextAction && (
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00]"></div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Target
                  className={cn(
                    'w-5 h-5',
                    isActionOverdue ? 'text-red-500' : 'text-[#FF6A00]',
                  )}
                />
                Próxima Ação
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setManualActionOpen(true)}
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] font-bold px-2 bg-white"
                >
                  <Plus className="w-3 h-3 mr-1" /> Adicionar ação
                </Button>
                {isActionOverdue && (
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> Atrasada
                  </span>
                )}
                {!isActionOverdue && leadData.nextAction && (
                  <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase rounded-full">
                    Pendente
                  </span>
                )}
              </div>
            </div>

            {leadData.nextAction ? (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900 text-base">
                    {leadData.nextAction}
                  </p>
                  <p className="text-sm font-medium text-slate-500 flex items-center mt-1">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {leadData.nextActionDate
                      ? format(
                          new Date(leadData.nextActionDate),
                          "dd 'de' MMMM 'às' HH:mm",
                          { locale: ptBR },
                        )
                      : 'Data não definida'}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleCompleteNextAction}
                    className="flex-1 sm:flex-none font-bold bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Concluir
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium mb-3">
                  Nenhuma ação futura agendada para este lead.
                </p>
                <Button
                  onClick={() => openInteraction('WhatsApp', 'Follow-up')}
                  variant="outline"
                  className="font-bold text-slate-700 border-slate-300 bg-white"
                >
                  <CalendarClock className="w-4 h-4 mr-2" /> Agendar Próxima
                  Ação
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /> Histórico de
                Ações
              </h2>
              <Button
                onClick={() => setManualActionOpen(true)}
                variant="outline"
                size="sm"
                className="h-7 text-[10px] font-bold px-2 bg-white"
              >
                <Plus className="w-3 h-3 mr-1" /> Adicionar ação
              </Button>
            </div>

            <div className="relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-slate-200 space-y-6">
              {leadActivities.length === 0 ? (
                <div className="pl-12 text-sm text-slate-500 font-medium">
                  Nenhum histórico registrado.
                </div>
              ) : (
                leadActivities.map((act) => {
                  let icon = <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  if (act.channel === 'WhatsApp')
                    icon = <MessageCircle className="w-4 h-4 text-green-500" />
                  else if (act.channel === 'Telefone' || act.type === 'Ligação')
                    icon = <Phone className="w-4 h-4 text-blue-500" />
                  else if (act.channel === 'E-mail' || act.type === 'E-mail')
                    icon = <Mail className="w-4 h-4 text-orange-500" />
                  else if (act.type.includes('Reunião'))
                    icon = <Calendar className="w-4 h-4 text-purple-500" />

                  return (
                    <div
                      key={act.id}
                      className="flex items-start relative pl-12 group"
                    >
                      <div className="absolute left-0 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:border-[#FF6A00] transition-colors">
                        {icon}
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 w-full group-hover:border-slate-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 text-sm flex items-center flex-wrap gap-2">
                            {act.type === 'Outro'
                              ? (act as any).custom_type
                              : act.type}
                            {(act as any).status &&
                              (act as any).status !== 'Pendente' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600">
                                  {(act as any).status}
                                </span>
                              )}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {format(new Date(act.date), 'dd/MM/yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">
                          {(act as any).description && (
                            <span className="block font-medium mb-1 text-slate-700">
                              {(act as any).description}
                            </span>
                          )}
                          {act.result || 'Ação registrada sem observação.'}
                        </p>
                        {act.nextAction && (
                          <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-start gap-2">
                            <CalendarClock className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                            <div>
                              <p className="text-[11px] font-bold text-slate-500 uppercase">
                                Ação Gerada
                              </p>
                              <p className="text-xs font-medium text-slate-700">
                                {act.nextAction} -{' '}
                                {act.nextActionDate
                                  ? format(
                                      new Date(act.nextActionDate),
                                      'dd/MM/yyyy HH:mm',
                                    )
                                  : ''}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Informações
              </h3>
              <Button
                onClick={() => setFullEditModalOpen(true)}
                variant="outline"
                size="sm"
                className="h-7 text-[10px] font-bold px-2 bg-white"
              >
                <Edit2 className="w-3 h-3 mr-1" /> Editar Lead Completo
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Empresa
                </label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={leadData.name || ''}
                    onChange={handleChange}
                    className="h-8 text-sm"
                  />
                ) : (
                  <div className="text-sm font-semibold text-slate-900">
                    {leadData.name}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Contato
                </label>
                {isEditing ? (
                  <Input
                    name="contactName"
                    value={leadData.contactName || ''}
                    onChange={handleChange}
                    className="h-8 text-sm"
                  />
                ) : (
                  <div className="text-sm font-medium text-slate-800">
                    {leadData.contactName || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Telefone
                </label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={leadData.phone || ''}
                    onChange={handleChange}
                    className="h-8 text-sm"
                  />
                ) : (
                  <div className="text-sm font-medium text-slate-800">
                    {leadData.phone || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  E-mail
                </label>
                {isEditing ? (
                  <Input
                    name="email"
                    value={leadData.email || ''}
                    onChange={handleChange}
                    className="h-8 text-sm"
                  />
                ) : (
                  <div className="text-sm font-medium text-slate-800 break-all">
                    {leadData.email || '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Localização
                </label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      name="city"
                      value={leadData.city || ''}
                      onChange={handleChange}
                      className="h-8 text-sm w-2/3"
                      placeholder="Cidade"
                    />
                    <Input
                      name="state"
                      value={leadData.state || ''}
                      onChange={handleChange}
                      className="h-8 text-sm w-1/3"
                      placeholder="UF"
                    />
                  </div>
                ) : (
                  <div className="text-sm font-medium text-slate-800">
                    {leadData.city
                      ? `${leadData.city} - ${leadData.state}`
                      : '-'}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Observações
                </label>
                {isEditing ? (
                  <Textarea
                    name="notes"
                    value={leadData.notes || ''}
                    onChange={handleChange}
                    className="h-20 text-sm resize-none"
                  />
                ) : (
                  <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100 whitespace-pre-wrap min-h-[3rem]">
                    {leadData.notes || '-'}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center">
              <Button
                onClick={handleLost}
                variant="ghost"
                className="text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 w-full"
              >
                <XCircle className="w-3.5 h-3.5 mr-1.5" /> Marcar como Perdido
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mb-6">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Propostas
              </h4>
              <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
                <Button
                  onClick={() =>
                    navigate(`/proposals/new?leadId=${leadData.id}`)
                  }
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] font-bold px-2 bg-white"
                >
                  <Plus className="w-3 h-3 mr-1" /> Nova
                </Button>
                <DialogContent className="hidden"></DialogContent>
              </Dialog>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-[300px]">
              {leadProposals.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 font-medium">
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
                      className="p-3 border border-slate-100 bg-white rounded-lg shadow-sm hover:shadow-md hover:border-orange-200 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                          {prop.proposalNumber || 'PRO-000'}
                        </span>
                        <span
                          className={cn(
                            'text-[9px] font-bold px-1.5 py-0.5 rounded uppercase',
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
                      <div className="text-sm font-black text-slate-800 mb-1">
                        {formatCurrency(val)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        {new Date(prop.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Pedidos
              </h4>
              <Button
                onClick={() => navigate(`/orders/new?leadId=${leadData.id}`)}
                variant="outline"
                size="sm"
                className="h-7 text-[10px] font-bold px-2 bg-white"
              >
                <Plus className="w-3 h-3 mr-1" /> Novo
              </Button>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-[300px]">
              {leadOrders.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 font-medium">
                  Nenhum pedido criado.
                </p>
              ) : (
                leadOrders.map((ord: any) => (
                  <div
                    key={ord.id}
                    onClick={() => navigate(`/orders/${ord.id}`)}
                    className="p-3 border border-slate-100 bg-white rounded-lg shadow-sm hover:shadow-md hover:border-orange-200 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                        {ord.order_number}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-600">
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-sm font-black text-slate-800 mb-1">
                      {formatCurrency(ord.total_amount || 0)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold">
                      {new Date(ord.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ManualActionModal
        open={manualActionOpen}
        onOpenChange={setManualActionOpen}
        accountId={leadData.id}
        onSuccess={() => window.location.reload()}
      />

      {fullEditModalOpen && (
        <LeadEditModal
          open={fullEditModalOpen}
          onOpenChange={setFullEditModalOpen}
          accountId={leadData.id}
          onSuccess={() => fetchAccount()}
        />
      )}

      <Dialog
        open={interactionModalOpen}
        onOpenChange={setInteractionModalOpen}
      >
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-slate-200 rounded-2xl bg-white">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-black text-slate-900">
              Registrar Ação
            </DialogTitle>
          </DialogHeader>
          <LeadInteractionForm
            account={leadData}
            onSuccess={() => setInteractionModalOpen(false)}
            defaultChannel={interactionDefaults.channel}
            defaultType={interactionDefaults.type}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
