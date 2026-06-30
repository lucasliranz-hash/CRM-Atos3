import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { generateProposalPDF } from '@/lib/export-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Send,
  Download,
  Phone,
  Upload,
  RefreshCw,
  Share2,
  Link as LinkIcon,
  MessageCircle,
  Mail,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
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
import {
  Proposal,
  ProposalItem,
  ProposalTerms,
  ProposalCover,
} from '@/types/crm'
import { formatCurrency } from '@/lib/crm-utils'
import useMainStore from '@/stores/main'

const defaultCover: ProposalCover = {
  title: 'Proposta Comercial',
  subtitle: 'Soluções em Telemetria e Gestão de Frota',
  introduction:
    'Agradecemos a oportunidade de apresentar nossa proposta para otimização e controle da sua frota. Nosso objetivo é entregar tecnologia de ponta para reduzir custos e aumentar sua eficiência.',
}

const defaultTerms: ProposalTerms = {
  paymentTerms: 'Boleto Bancário 15 dias',
  contractDuration: '36 meses',
  validity: '15 dias',
  installationDeadline: '10 dias úteis após aprovação',
  warranty: '12 meses contra defeitos de fabricação',
  notes: '',
}

const defaultTravelFee = {
  enabled: false,
  pricePerKm: 1.8,
  totalKm: 0,
  tolls: 0,
  otherExpenses: 0,
  notes:
    'Deslocamento cobrado conforme quilometragem rodada, acrescido de pedágios quando aplicável.',
  total: 0,
}

const TEMPLATES = {
  telemetria: {
    name: 'Modelo Telemetria',
    items: [
      {
        id: '',
        name: 'Equipamento Telemetria 4G',
        quantity: 1,
        unitPrice: 350,
        billingType: 'Por Veículo',
        category: 'Equipamento',
      },
      {
        id: '',
        name: 'Instalação Padrão',
        quantity: 1,
        unitPrice: 150,
        billingType: 'Único',
        category: 'Instalação',
      },
      {
        id: '',
        name: 'Licença Plataforma',
        quantity: 1,
        unitPrice: 49.9,
        billingType: 'Mensal',
        category: 'Mensalidade',
      },
    ],
  },
  comodato: {
    name: 'Modelo Comodato',
    items: [
      {
        id: '',
        name: 'Taxa de Adesão (Comodato)',
        quantity: 1,
        unitPrice: 100,
        billingType: 'Único',
        category: 'Instalação',
      },
      {
        id: '',
        name: 'Plano Telemetria + Equipamento',
        quantity: 1,
        unitPrice: 89.9,
        billingType: 'Mensal',
        category: 'Mensalidade',
      },
    ],
  },
}

const ImageUploadArea = ({
  label,
  value,
  onChange,
  onRemove,
  aspectRatio = 'video',
}: {
  label: string
  value: string | undefined
  onChange: (base64: string) => void
  onRemove: () => void
  aspectRatio?: 'video' | 'square' | 'auto'
}) => {
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onloadend = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase">
        {label}
      </label>
      {value ? (
        <div
          className={`relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center ${aspectRatio === 'video' ? 'aspect-video' : 'h-32'}`}
        >
          <img
            src={value}
            alt={label}
            className={`w-full h-full ${aspectRatio === 'video' ? 'object-cover' : 'object-contain p-4'}`}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0])
                  e.target.value = ''
                }}
              />
              <div className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">
                Trocar
              </div>
            </label>
            <button
              type="button"
              onClick={onRemove}
              className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-colors text-slate-500 ${aspectRatio === 'video' ? 'aspect-video' : 'h-32'}`}
        >
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0])
              e.target.value = ''
            }}
          />
          <Upload className="w-6 h-6 mb-2 text-slate-400" />
          <span className="text-sm font-bold">Clique ou arraste</span>
          <span className="text-xs text-slate-400">PNG, JPG, SVG</span>
        </label>
      )}
    </div>
  )
}

export default function ProposalEditor() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const fetchData = useMainStore((s: any) => s.fetchData)

  const [propData, setPropData] = useState<Proposal | null>(null)
  const [activeTab, setActiveTab] = useState('info')
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (id === 'new') {
        const leadId = searchParams.get('leadId')
        if (leadId) {
          const { data: lead } = await supabase
            .from('accounts')
            .select('*')
            .eq('id', leadId)
            .single()
          if (lead) {
            setPropData({
              id: crypto.randomUUID(),
              accountId: lead.id,
              proposalNumber: `PRO-${Math.floor(Math.random() * 10000)}`,
              status: 'Rascunho',
              companyName: lead.companyName || lead.name || '',
              contactName: lead.contactName || '',
              phone: lead.phone || '',
              email: lead.email || '',
              vehicleQuantity: lead.vehicleCount || lead.fleetEstimate || 0,
              cover: { ...defaultCover },
              items: [],
              terms: { ...defaultTerms },
              travelFee: { ...defaultTravelFee },
              totalSetup: 0,
              totalMonthly: 0,
              totalEquipment: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          }
        }
      } else {
        const { data: existing } = await supabase
          .from('proposals')
          .select('*')
          .eq('id', id)
          .single()
        if (existing) {
          setPropData({
            ...(existing as any),
            cover: existing.cover || { ...defaultCover },
            items: existing.items || [],
            terms: existing.terms || { ...defaultTerms },
            travelFee: existing.travelFee || { ...defaultTravelFee },
          })
        }
      }
    }
    loadData()
  }, [id, searchParams])

  const calculatedTotals = useMemo(() => {
    if (!propData) return { setup: 0, monthly: 0, equipment: 0, travel: 0 }
    let setup = 0
    let monthly = 0
    let equipment = 0
    let travel = 0

    if (propData.travelFee?.enabled) {
      travel =
        propData.travelFee.pricePerKm * propData.travelFee.totalKm +
        (propData.travelFee.tolls || 0) +
        (propData.travelFee.otherExpenses || 0)
    }

    propData.items.forEach((item) => {
      const totalItem = item.unitPrice * item.quantity
      if (item.billingType === 'Único') {
        if (item.category === 'Equipamento') equipment += totalItem
        else setup += totalItem
      } else if (
        item.billingType === 'Mensal' ||
        item.billingType === 'Por Veículo'
      ) {
        monthly += totalItem
      } else if (item.billingType === 'Anual') {
        monthly += totalItem / 12
      }
    })
    return { setup, monthly, equipment, travel }
  }, [propData?.items, propData?.travelFee])

  const logActivity = async (title: string, description: string = '') => {
    if (!propData?.accountId) return
    await supabase.from('activities').insert({
      accountId: propData.accountId,
      type: 'Proposta enviada',
      title,
      description,
      date: new Date().toISOString(),
      channel: 'E-mail',
      completed: true,
      status: 'Realizada',
    })
  }

  const handleSave = async () => {
    if (!propData) return
    setIsSaving(true)
    try {
      const finalProp = {
        ...propData,
        totalSetup: calculatedTotals.setup + calculatedTotals.travel,
        totalMonthly: calculatedTotals.monthly,
        totalEquipment: calculatedTotals.equipment,
        value:
          calculatedTotals.setup +
          calculatedTotals.travel +
          calculatedTotals.monthly * 12 +
          calculatedTotals.equipment,
        travelFee: propData.travelFee
          ? {
              ...propData.travelFee,
              total: calculatedTotals.travel,
            }
          : undefined,
      }

      const payload = {
        accountId: finalProp.accountId,
        proposalNumber: finalProp.proposalNumber,
        status: finalProp.status,
        companyName: finalProp.companyName,
        contactName: finalProp.contactName,
        vehicleQuantity: finalProp.vehicleQuantity,
        totalSetup: finalProp.totalSetup,
        totalMonthly: finalProp.totalMonthly,
        totalEquipment: finalProp.totalEquipment,
        travelFee: finalProp.travelFee,
        value: finalProp.value,
        items: finalProp.items,
        cover: finalProp.cover,
        terms: finalProp.terms,
        updatedAt: new Date().toISOString(),
      }

      if (id === 'new') {
        const newId = crypto.randomUUID()
        const { error } = await supabase
          .from('proposals')
          .insert({ ...payload, id: newId })
        if (error) throw error
        await logActivity(
          'Proposta criada',
          `Proposta ${finalProp.proposalNumber} criada no valor de ${formatCurrency(finalProp.value || 0)}`,
        )
        window.dispatchEvent(new Event('lead_updated'))
        fetchData()
        toast({ title: 'Proposta salva com sucesso!' })
        navigate(`/proposals/${newId}`, { replace: true })
      } else {
        const { error } = await supabase
          .from('proposals')
          .update(payload)
          .eq('id', id)
        if (error) throw error
        await logActivity(
          'Proposta atualizada',
          `Proposta ${finalProp.proposalNumber} atualizada.`,
        )
        window.dispatchEvent(new Event('lead_updated'))
        fetchData()
        toast({ title: 'Proposta salva com sucesso!' })
      }
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar proposta',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePdfGeneration = async () => {
    setActiveTab('preview')
    setIsGeneratingPdf(true)

    try {
      await logActivity(
        'PDF gerado',
        `PDF da proposta ${propData?.proposalNumber} gerado.`,
      )

      setTimeout(async () => {
        try {
          const fileName =
            `Proposta_${propData?.companyName || 'Cliente'}_${propData?.proposalNumber || 'Novo'}.pdf`.replace(
              /\s+/g,
              '_',
            )
          await generateProposalPDF('proposal-pdf-content', fileName)
          toast({ title: 'PDF gerado com sucesso!' })
        } catch (e) {
          toast({ title: 'Erro ao gerar PDF', variant: 'destructive' })
        } finally {
          setIsGeneratingPdf(false)
        }
      }, 800)
    } catch (err) {
      setIsGeneratingPdf(false)
      toast({ title: 'Erro ao preparar PDF', variant: 'destructive' })
    }
  }

  const handleShare = async (type: 'link' | 'whatsapp' | 'email') => {
    const url = `${window.location.origin}/proposals/${propData?.id || id}`
    if (type === 'link') {
      navigator.clipboard.writeText(url)
      toast({ title: 'Link copiado!' })
      await logActivity(
        'Proposta compartilhada via Link',
        `Link gerado e copiado.`,
      )
    } else if (type === 'whatsapp') {
      window.open(
        `https://wa.me/?text=Olá! Segue o link da nossa proposta: ${url}`,
      )
      await logActivity(
        'Proposta compartilhada via WhatsApp',
        `Link aberto no WhatsApp.`,
      )
    } else if (type === 'email') {
      window.location.href = `mailto:?subject=Proposta Comercial&body=Olá! Segue o link da nossa proposta: ${url}`
      await logActivity(
        'Proposta compartilhada via E-mail',
        `Rascunho de e-mail aberto.`,
      )
    }
  }

  const applyTemplate = (templateKey: string) => {
    const tpl = TEMPLATES[templateKey as keyof typeof TEMPLATES]
    if (!tpl || !propData) return
    const newItems = tpl.items.map((i) => ({
      ...i,
      id: crypto.randomUUID(),
      quantity:
        i.billingType === 'Por Veículo' || i.category === 'Equipamento'
          ? propData.vehicleQuantity || 1
          : i.quantity,
    }))
    setPropData((prev) => ({
      ...prev!,
      items: [...prev!.items, ...(newItems as ProposalItem[])],
    }))
  }

  const addItem = () => {
    if (!propData) return
    const newItem: ProposalItem = {
      id: crypto.randomUUID(),
      name: 'Novo Item',
      quantity: 1,
      unitPrice: 0,
      billingType: 'Único',
      category: 'Outros',
    }
    setPropData((prev) => ({ ...prev!, items: [...prev!.items, newItem] }))
  }

  const updateTravelFee = (field: string, value: any) => {
    setPropData((prev) => {
      if (!prev || !prev.travelFee) return prev
      return {
        ...prev,
        travelFee: { ...prev.travelFee, [field]: value },
      }
    })
  }

  const updateItem = (itemId: string, field: string, value: any) => {
    setPropData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        items: prev.items.map((i) => {
          if (i.id === itemId) {
            const updated = { ...i, [field]: value }
            if (field === 'billingType' && value === 'Por Veículo') {
              updated.quantity = prev.vehicleQuantity || 1
            }
            return updated
          }
          return i
        }),
      }
    })
  }

  const removeItem = (itemId: string) => {
    setPropData((prev) =>
      prev
        ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) }
        : prev,
    )
  }

  if (!propData)
    return (
      <div className="p-10 text-center text-slate-500">
        Carregando proposta...
      </div>
    )

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-slate-500 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {propData.proposalNumber}
              <Select
                value={propData.status}
                onValueChange={(val: any) =>
                  setPropData({ ...propData, status: val })
                }
              >
                <SelectTrigger
                  className={`h-7 px-2 border-0 text-xs font-bold w-[110px] ${
                    propData.status === 'Enviada'
                      ? 'bg-orange-100 text-orange-700'
                      : propData.status === 'Aprovada'
                        ? 'bg-emerald-100 text-emerald-700'
                        : propData.status === 'Recusada'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                  <SelectItem value="Enviada">Enviada</SelectItem>
                  <SelectItem value="Em negociação">Em negociação</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Ganha">Ganha</SelectItem>
                  <SelectItem value="Recusada">Recusada</SelectItem>
                  <SelectItem value="Perdida">Perdida</SelectItem>
                </SelectContent>
              </Select>
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Para: {propData.companyName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="font-bold border-slate-200"
            onClick={handlePdfGeneration}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isGeneratingPdf ? 'Gerando...' : 'Gerar PDF'}
          </Button>
          <Button
            variant="outline"
            className="font-bold border-slate-200"
            onClick={() => setShareModalOpen(true)}
            disabled={id === 'new'}
          >
            <Share2 className="w-4 h-4 mr-2 text-green-600" /> Compartilhar
          </Button>
          <Button
            className="bg-[#FF6A00] hover:bg-[#e65c00] text-white font-bold shadow-sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Salvando...' : 'Salvar Proposta'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full bg-slate-100/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="info" className="rounded-lg font-bold">
            Informações
          </TabsTrigger>
          <TabsTrigger value="cover" className="rounded-lg font-bold">
            Capa & Textos
          </TabsTrigger>
          <TabsTrigger value="items" className="rounded-lg font-bold">
            Solução & Valores
          </TabsTrigger>
          <TabsTrigger value="terms" className="rounded-lg font-bold">
            Termos
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="rounded-lg font-bold bg-[#0D1B2A]/5 data-[state=active]:bg-[#0D1B2A] data-[state=active]:text-white transition-colors"
          >
            Preview Final
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Empresa / Lead
              </label>
              <Input
                value={propData.companyName}
                onChange={(e) =>
                  setPropData({ ...propData, companyName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Nome do Contato
              </label>
              <Input
                value={propData.contactName}
                onChange={(e) =>
                  setPropData({ ...propData, contactName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                E-mail
              </label>
              <Input
                value={propData.email}
                onChange={(e) =>
                  setPropData({ ...propData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Telefone / WhatsApp
              </label>
              <Input
                value={propData.phone}
                onChange={(e) =>
                  setPropData({ ...propData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Quantidade de Veículos Estimada
              </label>
              <Input
                type="number"
                value={propData.vehicleQuantity}
                onChange={(e) =>
                  setPropData({
                    ...propData,
                    vehicleQuantity: Number(e.target.value),
                  })
                }
              />
              <p className="text-xs text-slate-400 mt-1">
                Isso será usado para automatizar itens do tipo "Por Veículo".
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cover" className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-black text-lg text-slate-900">
              Customização Visual
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadArea
                label="Logo da Empresa"
                value={propData.cover.logoImage || propData.cover.logoUrl}
                onChange={(base64) =>
                  setPropData({
                    ...propData,
                    cover: {
                      ...propData.cover,
                      logoImage: base64,
                      logoUrl: '',
                    },
                  })
                }
                onRemove={() =>
                  setPropData({
                    ...propData,
                    cover: { ...propData.cover, logoImage: '', logoUrl: '' },
                  })
                }
                aspectRatio="auto"
              />
              <ImageUploadArea
                label="Imagem de Capa"
                value={
                  propData.cover.coverImage || propData.cover.coverImageUrl
                }
                onChange={(base64) =>
                  setPropData({
                    ...propData,
                    cover: {
                      ...propData.cover,
                      coverImage: base64,
                      coverImageUrl: '',
                    },
                  })
                }
                onRemove={() =>
                  setPropData({
                    ...propData,
                    cover: {
                      ...propData.cover,
                      coverImage: '',
                      coverImageUrl: '',
                    },
                  })
                }
                aspectRatio="video"
              />
            </div>
            <div className="border-t border-slate-100 pt-6 space-y-6">
              <h3 className="font-black text-lg text-slate-900">
                Textos Introdutórios
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Título da Proposta
                </label>
                <Input
                  value={propData.cover.title}
                  onChange={(e) =>
                    setPropData({
                      ...propData,
                      cover: { ...propData.cover, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Subtítulo
                </label>
                <Input
                  value={propData.cover.subtitle}
                  onChange={(e) =>
                    setPropData({
                      ...propData,
                      cover: { ...propData.cover, subtitle: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Texto de Introdução / Apresentação
                </label>
                <Textarea
                  className="h-32 resize-none"
                  value={propData.cover.introduction}
                  onChange={(e) =>
                    setPropData({
                      ...propData,
                      cover: {
                        ...propData.cover,
                        introduction: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <Select onValueChange={applyTemplate}>
                <SelectTrigger className="w-[200px] h-10 border-slate-200 font-bold text-slate-700 bg-slate-50">
                  <SelectValue placeholder="Importar Modelo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telemetria">Modelo Telemetria</SelectItem>
                  <SelectItem value="comodato">Modelo Comodato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={addItem}
              className="font-bold bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Item Manual
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-xs w-[30%]">
                      Item / Serviço
                    </th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-xs">
                      Categoria
                    </th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-xs">
                      Cobrança
                    </th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-xs w-24">
                      Qtd
                    </th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-xs w-32">
                      R$ Unit.
                    </th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-xs text-right w-32">
                      Total
                    </th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase text-xs w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {propData.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-slate-500 font-medium"
                      >
                        Nenhum item adicionado. Use um modelo ou adicione
                        manualmente.
                      </td>
                    </tr>
                  )}
                  {propData.items.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <Input
                          className="h-8 text-sm font-bold mb-1"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, 'name', e.target.value)
                          }
                          placeholder="Nome do item"
                        />
                        <Input
                          className="h-7 text-xs text-slate-500"
                          value={item.description || ''}
                          onChange={(e) =>
                            updateItem(item.id, 'description', e.target.value)
                          }
                          placeholder="Descrição curta (opcional)"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={item.category}
                          onValueChange={(val) =>
                            updateItem(item.id, 'category', val)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Equipamento">
                              Equipamento
                            </SelectItem>
                            <SelectItem value="Instalação">
                              Instalação
                            </SelectItem>
                            <SelectItem value="Mensalidade">
                              Mensalidade
                            </SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={item.billingType}
                          onValueChange={(val) =>
                            updateItem(item.id, 'billingType', val)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Único">Único</SelectItem>
                            <SelectItem value="Mensal">Mensal</SelectItem>
                            <SelectItem value="Por Veículo">
                              Por Veículo/Mês
                            </SelectItem>
                            <SelectItem value="Anual">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          className="h-8 text-sm"
                          value={item.quantity}
                          disabled={item.billingType === 'Por Veículo'}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              'quantity',
                              Number(e.target.value),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          step="0.01"
                          className="h-8 text-sm"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              'unitPrice',
                              Number(e.target.value),
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
              <div className="w-72 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">
                    Total Equipamentos:
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(calculatedTotals.equipment)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">
                    Total Setup / Adesão:
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(calculatedTotals.setup)}
                  </span>
                </div>
                {propData.travelFee?.enabled && (
                  <div className="flex justify-between text-sm text-slate-500">
                    <span className="font-medium">Deslocamento:</span>
                    <span className="font-bold">
                      {formatCurrency(calculatedTotals.travel)}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="text-slate-900 font-black">
                    Total Implantação:
                  </span>
                  <span className="font-black text-slate-900">
                    {formatCurrency(
                      calculatedTotals.equipment +
                        calculatedTotals.setup +
                        calculatedTotals.travel,
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="text-slate-900 font-black">
                    Recorrente Mensal (MRR):
                  </span>
                  <span className="font-black text-[#FF6A00]">
                    {formatCurrency(calculatedTotals.monthly)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                Deslocamento e custos de viagem
              </h3>
              <div className="flex items-center gap-2">
                <Switch
                  checked={propData.travelFee?.enabled || false}
                  onCheckedChange={(c) => updateTravelFee('enabled', c)}
                  id="travel-fee-toggle"
                />
                <label
                  htmlFor="travel-fee-toggle"
                  className="text-sm font-bold text-slate-700 cursor-pointer"
                >
                  Cobrar deslocamento?
                </label>
              </div>
            </div>

            {propData.travelFee?.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Valor por km rodado
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={propData.travelFee.pricePerKm}
                    onChange={(e) =>
                      updateTravelFee('pricePerKm', Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Quantidade de km
                  </label>
                  <Input
                    type="number"
                    value={propData.travelFee.totalKm}
                    onChange={(e) =>
                      updateTravelFee('totalKm', Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Valor total de pedágio
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={propData.travelFee.tolls}
                    onChange={(e) =>
                      updateTravelFee('tolls', Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Outras despesas
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={propData.travelFee.otherExpenses}
                    onChange={(e) =>
                      updateTravelFee('otherExpenses', Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-4">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Observação do deslocamento
                  </label>
                  <Textarea
                    value={propData.travelFee.notes}
                    onChange={(e) => updateTravelFee('notes', e.target.value)}
                    className="h-20 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Forma de Pagamento
              </label>
              <Input
                value={propData.terms.paymentTerms}
                onChange={(e) =>
                  setPropData({
                    ...propData,
                    terms: { ...propData.terms, paymentTerms: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Duração do Contrato
              </label>
              <Input
                value={propData.terms.contractDuration}
                onChange={(e) =>
                  setPropData({
                    ...propData,
                    terms: {
                      ...propData.terms,
                      contractDuration: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Validade da Proposta
              </label>
              <Input
                value={propData.terms.validity}
                onChange={(e) =>
                  setPropData({
                    ...propData,
                    terms: { ...propData.terms, validity: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Prazo de Instalação
              </label>
              <Input
                value={propData.terms.installationDeadline}
                onChange={(e) =>
                  setPropData({
                    ...propData,
                    terms: {
                      ...propData.terms,
                      installationDeadline: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Garantia
              </label>
              <Input
                value={propData.terms.warranty}
                onChange={(e) =>
                  setPropData({
                    ...propData,
                    terms: { ...propData.terms, warranty: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Observações Adicionais (Opcional)
              </label>
              <Textarea
                className="h-24 resize-none"
                value={propData.terms.notes}
                onChange={(e) =>
                  setPropData({
                    ...propData,
                    terms: { ...propData.terms, notes: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="preview"
          className="space-y-6 overflow-x-auto custom-scrollbar flex justify-center pb-8"
        >
          <div
            id="proposal-pdf-content"
            className="proposal-preview print-area bg-white p-8 md:p-12 border border-slate-200 shadow-md mx-auto rounded-xl print:shadow-none print:border-none print:p-0 text-slate-900 relative shrink-0"
          >
            <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
              {propData.cover.logoImage || propData.cover.logoUrl ? (
                <img
                  src={propData.cover.logoImage || propData.cover.logoUrl}
                  alt="Logo"
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <div className="text-2xl font-black tracking-tighter text-[#0D1B2A]">
                  Sua<span className="text-[#FF6A00]">Logo</span>
                </div>
              )}
              <div className="text-right">
                <h2 className="text-xl font-black text-slate-900">
                  {propData.proposalNumber}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Emissão:{' '}
                  {new Date(propData.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {propData.cover.coverImage || propData.cover.coverImageUrl ? (
              <div className="relative mb-12 rounded-2xl overflow-hidden min-h-[320px] bg-slate-900 shadow-inner flex flex-col items-center justify-center p-8 text-center">
                <img
                  src={
                    propData.cover.coverImage || propData.cover.coverImageUrl
                  }
                  className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
                  alt="Capa"
                />
                <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                    {propData.cover.title}
                  </h1>
                  <h3 className="text-xl font-bold text-orange-400 drop-shadow-sm">
                    {propData.cover.subtitle}
                  </h3>
                  <p className="text-slate-200 leading-relaxed mt-4 text-sm md:text-base drop-shadow-sm">
                    {propData.cover.introduction}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-12 text-center space-y-4 max-w-3xl mx-auto py-12">
                <h1 className="text-4xl md:text-5xl font-black text-[#0D1B2A] tracking-tight">
                  {propData.cover.title}
                </h1>
                <h3 className="text-xl font-bold text-[#FF6A00]">
                  {propData.cover.subtitle}
                </h3>
                <p className="text-slate-600 leading-relaxed mt-4 text-sm md:text-base">
                  {propData.cover.introduction}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Preparado Para
                </h4>
                <p className="font-black text-xl text-slate-900 mb-1">
                  {propData.companyName || 'Empresa Cliente'}
                </p>
                <p className="text-sm font-bold text-slate-700 mb-1">
                  A/C: {propData.contactName || '-'}
                </p>
                <p className="text-sm text-slate-500">
                  {propData.email} {propData.phone && `| ${propData.phone}`}
                </p>
              </div>
              <div className="md:text-right">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Resumo do Projeto
                </h4>
                <p className="text-sm text-slate-600 font-medium mb-1">
                  Frota Mapeada:
                </p>
                <p className="text-2xl font-black text-[#0D1B2A]">
                  {propData.vehicleQuantity} veículos
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm">
                  1
                </span>
                Investimentos e Solução
              </h3>
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="py-4 px-5 font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                        Item/Serviço
                      </th>
                      <th className="py-4 px-5 font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                        Formato
                      </th>
                      <th className="py-4 px-5 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">
                        Qtd
                      </th>
                      <th className="py-4 px-5 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">
                        Unitário
                      </th>
                      <th className="py-4 px-5 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {propData.items.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-xs text-slate-500 mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                            {item.billingType}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right font-medium text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-5 text-right font-medium text-slate-700">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-4 px-5 text-right font-black text-slate-900">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                    {propData.items.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-slate-400 text-sm"
                        >
                          Nenhum item adicionado na proposta.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {propData.travelFee?.enabled && (
              <div className="mb-12">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                  Deslocamento e Custos de Viagem
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100 mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                      Valor por km rodado
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(propData.travelFee.pricePerKm)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                      KM estimado
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {propData.travelFee.totalKm} km
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                      Pedágio
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(propData.travelFee.tolls)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                      Outras despesas
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(propData.travelFee.otherExpenses)}
                    </p>
                  </div>
                </div>
                {propData.travelFee.notes && (
                  <p className="text-sm text-slate-500 italic mb-4">
                    {propData.travelFee.notes}
                  </p>
                )}
                <div className="flex justify-end">
                  <div className="bg-slate-100 px-4 py-3 rounded-lg flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-600">
                      Total de deslocamento:
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      {formatCurrency(calculatedTotals.travel)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mb-16">
              <div className="w-80 space-y-4 bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">
                    Equipamentos:
                  </span>
                  <span className="font-bold">
                    {formatCurrency(calculatedTotals.equipment)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">
                    Instalação / Setup:
                  </span>
                  <span className="font-bold">
                    {formatCurrency(calculatedTotals.setup)}
                  </span>
                </div>
                {propData.travelFee?.enabled && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">
                      Deslocamento:
                    </span>
                    <span className="font-bold">
                      {formatCurrency(calculatedTotals.travel)}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-3 flex justify-between text-sm mb-4">
                  <span className="font-medium">Total Implantação:</span>
                  <span className="font-bold text-white">
                    {formatCurrency(
                      calculatedTotals.equipment +
                        calculatedTotals.setup +
                        calculatedTotals.travel,
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
                  <div>
                    <div className="font-black text-lg">Recorrente Mensal</div>
                    <div className="text-xs text-slate-400">
                      Faturamento MRR
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#FF6A00]">
                    {formatCurrency(calculatedTotals.monthly)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-sm">
                  2
                </span>
                Condições Comerciais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <div>
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Pagamento
                  </h5>
                  <p className="text-sm font-bold text-slate-800">
                    {propData.terms.paymentTerms}
                  </p>
                </div>
                <div>
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Duração do Contrato
                  </h5>
                  <p className="text-sm font-bold text-slate-800">
                    {propData.terms.contractDuration}
                  </p>
                </div>
                <div>
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Prazo de Instalação
                  </h5>
                  <p className="text-sm font-bold text-slate-800">
                    {propData.terms.installationDeadline}
                  </p>
                </div>
                <div>
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Validade da Proposta
                  </h5>
                  <p className="text-sm font-bold text-slate-800">
                    {propData.terms.validity}
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    Garantia
                  </h5>
                  <p className="text-sm font-bold text-slate-800">
                    {propData.terms.warranty}
                  </p>
                </div>
              </div>
              {propData.terms.notes && (
                <div className="mt-4 p-5 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-900">
                  <strong className="font-black mr-2">Observações:</strong>{' '}
                  {propData.terms.notes}
                </div>
              )}
            </div>

            <div className="mt-20 pt-10 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Esta proposta é um documento oficial emitido em{' '}
                {new Date(propData.createdAt).toLocaleDateString('pt-BR')}.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Compartilhar Proposta</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              variant="outline"
              className="justify-start h-12"
              onClick={() => handleShare('link')}
            >
              <LinkIcon className="w-4 h-4 mr-3 text-slate-500" /> Copiar Link
            </Button>
            <Button
              variant="outline"
              className="justify-start h-12"
              onClick={() => handleShare('whatsapp')}
            >
              <MessageCircle className="w-4 h-4 mr-3 text-green-500" />{' '}
              Compartilhar no WhatsApp
            </Button>
            <Button
              variant="outline"
              className="justify-start h-12"
              onClick={() => handleShare('email')}
            >
              <Mail className="w-4 h-4 mr-3 text-blue-500" /> Enviar por E-mail
            </Button>
            <Button
              variant="outline"
              className="justify-start h-12"
              onClick={() => {
                setShareModalOpen(false)
                handlePdfGeneration()
              }}
            >
              <Download className="w-4 h-4 mr-3 text-slate-500" /> Baixar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
