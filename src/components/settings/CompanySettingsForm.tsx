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
import {
  Building2,
  Upload,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react'

export function CompanySettingsForm() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const mainStore = useMainStore() || {}
  const logoUrl = mainStore.logoUrl
  const setLogoUrl = mainStore.setLogoUrl
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<any>({
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
    fetchSettings()
  }, [profile?.loja_id])

  const fetchSettings = async () => {
    let targetLojaId = profile?.loja_id
    if (!targetLojaId) {
      const { data: lojas } = await supabase.from('lojas').select('id').limit(1)
      if (lojas && lojas.length > 0) {
        targetLojaId = lojas[0].id
      }
    }
    if (!targetLojaId) return

    const { data } = await supabase
      .from('company_settings' as any)
      .select('*')
      .eq('loja_id', targetLojaId)
      .maybeSingle()

    if (data) {
      console.log('Dados carregados do Supabase:', data)
      setFormData((prev: any) => ({ ...prev, ...data }))
      if (data.logo_url && typeof setLogoUrl === 'function') {
        setLogoUrl(data.logo_url)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }

    setLoading(true)

    let targetLojaId = profile?.loja_id
    if (!targetLojaId) {
      const { data: lojas } = await supabase.from('lojas').select('id').limit(1)
      if (lojas && lojas.length > 0) {
        targetLojaId = lojas[0].id
      }
    }

    if (!targetLojaId) {
      const err =
        'Sua conta não possui uma Loja vinculada. É necessário ter uma loja para salvar as configurações.'
      toast({
        title: 'Erro de Vínculo',
        description: err,
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const payload = {
      ...formData,
      loja_id: targetLojaId,
      user_id: user?.id,
      logo_url: logoUrl || formData.logo_url,
      updated_at: new Date().toISOString(),
    }

    if (payload.id) delete payload.id
    if (payload.created_at) delete payload.created_at

    try {
      const { error } = await supabase
        .from('company_settings' as any)
        .upsert(payload, { onConflict: 'loja_id' })

      if (error) throw error

      toast({ title: 'Dados da empresa salvos com sucesso' })
      await fetchSettings()
    } catch (e: any) {
      console.error('Exception ao salvar:', e)
      toast({
        title: 'Erro ao salvar dados da empresa',
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
        description: 'Apenas imagens são permitidas (PNG, JPG, SVG).',
        variant: 'destructive',
      })
      return
    }
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `company-logo-${Date.now()}.${fileExt}`
      const filePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('company-assets').getPublicUrl(filePath)

      let targetLojaId = profile?.loja_id
      if (!targetLojaId) {
        const { data: lojas } = await supabase
          .from('lojas')
          .select('id')
          .limit(1)
        if (lojas && lojas.length > 0) targetLojaId = lojas[0].id
      }

      if (targetLojaId) {
        const logoPayload = {
          ...formData,
          loja_id: targetLojaId,
          user_id: user?.id,
          logo_url: publicUrl,
          updated_at: new Date().toISOString(),
        }

        if (logoPayload.id) delete logoPayload.id
        if (logoPayload.created_at) delete logoPayload.created_at

        const { error } = await supabase
          .from('company_settings' as any)
          .upsert(logoPayload, { onConflict: 'loja_id' })
      }

      setFormData((prev: any) => ({ ...prev, logo_url: publicUrl }))
      if (typeof setLogoUrl === 'function') {
        setLogoUrl(publicUrl)
      }
      toast({ title: 'Logo atualizada com sucesso!' })
      await fetchSettings()
    } catch (error: any) {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveLogo = async () => {
    let targetLojaId = profile?.loja_id
    if (!targetLojaId) {
      const { data: lojas } = await supabase.from('lojas').select('id').limit(1)
      if (lojas && lojas.length > 0) targetLojaId = lojas[0].id
    }

    if (!targetLojaId) return
    try {
      const payload = {
        ...formData,
        loja_id: targetLojaId,
        user_id: user?.id,
        logo_url: null,
        updated_at: new Date().toISOString(),
      }

      if (payload.id) delete payload.id
      if (payload.created_at) delete payload.created_at

      const { error } = await supabase
        .from('company_settings' as any)
        .upsert(payload, { onConflict: 'loja_id' })

      if (error) throw error

      setFormData((prev: any) => ({ ...prev, logo_url: null }))
      if (typeof setLogoUrl === 'function') {
        setLogoUrl(null)
      }
      toast({ title: 'Logo removida com sucesso!' })
      await fetchSettings()
    } catch (error: any) {
      console.error('Erro ao remover logo', error)
      toast({
        title: 'Erro ao remover logo',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="shadow-sm border-gray-200 bg-white mb-6 animate-in fade-in duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-slate-500" />
          Dados da Empresa Emitente
        </CardTitle>
        <CardDescription className="text-base text-slate-500">
          Configurações da sua empresa que aparecerão automaticamente nas fichas
          de pedidos, propostas e PDFs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
            Logo da empresa
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border rounded-xl bg-slate-50">
            <div className="w-40 h-40 bg-white rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-2 relative overflow-hidden shrink-0">
              {logoUrl || formData.logo_url ? (
                <img
                  src={logoUrl || formData.logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-xs font-medium">Sem logo</span>
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-3">
              <p className="text-sm text-slate-500">
                Aceita PNG, JPG, JPEG e SVG. Essa logo aparecerá automaticamente
                no cabeçalho das suas Fichas de Pedido.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                  className="hidden"
                />
                {!(logoUrl || formData.logo_url) ? (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    variant="default"
                    className="bg-slate-900 text-white hover:bg-slate-800"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Enviar logo
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      variant="default"
                      className="bg-slate-900 text-white hover:bg-slate-800"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Trocar logo
                    </Button>
                    <Button
                      onClick={handleRemoveLogo}
                      disabled={uploading}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover logo
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
            Informações Cadastrais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Razão Social</Label>
              <Input
                name="company_name"
                value={formData.company_name || ''}
                onChange={handleChange}
                placeholder="Ex: Minha Empresa LTDA"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome Fantasia</Label>
              <Input
                name="fantasy_name"
                value={formData.fantasy_name || ''}
                onChange={handleChange}
                placeholder="Ex: Nome da Marca"
              />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                name="cnpj"
                value={formData.cnpj || ''}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <Label>Inscrição Estadual</Label>
              <Input
                name="state_registration"
                value={formData.state_registration || ''}
                onChange={handleChange}
                placeholder="000.000.000.000"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="(00) 0000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                name="whatsapp"
                value={formData.whatsapp || ''}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="contato@empresa.com.br"
              />
            </div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Input
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
                placeholder="www.empresa.com.br"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
            Endereço
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                name="zip_code"
                value={formData.zip_code || ''}
                onChange={handleChange}
                placeholder="00000-000"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Endereço</Label>
              <Input
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="Rua, Avenida..."
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
            <div className="space-y-2 md:col-span-2">
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
                placeholder="UF"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">
            Responsável
          </h3>
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

        <form onSubmit={handleSave} className="flex justify-end pt-8 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-6 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'SALVAR DADOS DA EMPRESA'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
