import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import useMainStore from '@/stores/main'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Upload, Loader2, Image as ImageIcon } from 'lucide-react'

export function CompanySettingsForm() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const { logoUrl, setLogoUrl } = useMainStore()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    company_name: '',
    fantasy_name: '',
    cnpj: '',
    state_registration: '',
    address: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    responsible_name: '',
    responsible_role: '',
  })

  useEffect(() => {
    if (profile?.loja_id) {
      fetchSettings()
    }
  }, [profile?.loja_id])

  const fetchSettings = async () => {
    if (!profile?.loja_id) return
    const { data } = await supabase
      .from('company_settings' as any)
      .select('*')
      .eq('loja_id', profile.loja_id)
      .maybeSingle()
    if (data) {
      setFormData((prev) => ({ ...prev, ...data }))
      if (data.logo_url) setLogoUrl(data.logo_url)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!profile?.loja_id) return
    setLoading(true)
    try {
      const { error } = await supabase.from('company_settings' as any).upsert(
        {
          loja_id: profile.loja_id,
          ...formData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'loja_id' },
      )

      if (error) throw error
      toast({ title: 'Dados da empresa salvos com sucesso!' })
    } catch (e: any) {
      toast({
        title: 'Erro ao salvar',
        description: e.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Formato inválido',
        description: 'Apenas imagens são permitidas.',
        variant: 'destructive',
      })
      return
    }
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile?.loja_id || 'default'}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('company_logos')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('company_logos').getPublicUrl(fileName)

      if (profile?.loja_id) {
        await supabase.from('company_settings' as any).upsert(
          {
            loja_id: profile.loja_id,
            ...formData,
            logo_url: publicUrl,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'loja_id' },
        )
      }
      setLogoUrl(publicUrl)
      toast({ title: 'Logo atualizada com sucesso!' })
    } catch (error: any) {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="shadow-sm border-gray-200 bg-white mb-6 animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-500" />
          Dados da Empresa Emitente
        </CardTitle>
        <CardDescription>
          Configurações da sua empresa que aparecerão automaticamente nas fichas
          de pedidos, propostas e PDFs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border rounded-xl bg-slate-50">
          <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-2 relative overflow-hidden shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-300" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h4 className="font-bold text-slate-800">Logo da Empresa</h4>
            <p className="text-sm text-slate-500">
              Recomendado: PNG ou SVG com fundo transparente. Aparecerá no topo
              de todas as Fichas de Pedido.
            </p>
            <div className="pt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                variant="outline"
                className="bg-white"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {logoUrl ? 'Trocar Logo' : 'Enviar Logo'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Razão Social</Label>
            <Input
              name="company_name"
              value={formData.company_name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Nome Fantasia</Label>
            <Input
              name="fantasy_name"
              value={formData.fantasy_name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input
              name="cnpj"
              value={formData.cnpj || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Inscrição Estadual</Label>
            <Input
              name="state_registration"
              value={formData.state_registration || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input
              name="whatsapp"
              value={formData.whatsapp || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Site</Label>
            <Input
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 border-t pt-4 mt-2">
            <h4 className="font-semibold text-slate-800 mb-4">Endereço</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>CEP</Label>
                <Input
                  name="zip_code"
                  value={formData.zip_code || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Endereço</Label>
                <Input
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input
                  name="number"
                  value={formData.number || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input
                  name="district"
                  value={formData.district || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 border-t pt-4 mt-2">
            <h4 className="font-semibold text-slate-800 mb-4">Responsável</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Responsável</Label>
                <Input
                  name="responsible_name"
                  value={formData.responsible_name || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo do Responsável</Label>
                <Input
                  name="responsible_role"
                  value={formData.responsible_role || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-black text-white px-8"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Salvar Dados da Empresa
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
