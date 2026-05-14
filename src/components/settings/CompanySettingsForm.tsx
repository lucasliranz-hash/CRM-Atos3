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
  const { logoUrl, setLogoUrl } = useMainStore()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [debugState, setDebugState] = useState({
    clicked: false,
    saving: false,
    lastError: null as string | null,
    lastSuccess: null as string | null,
    payload: null as any,
    response: null as any,
  })
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
      if (data.logo_url) setLogoUrl(data.logo_url)
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

    setDebugState((prev) => ({
      ...prev,
      clicked: true,
      saving: true,
      lastError: null,
      lastSuccess: null,
    }))
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
      setDebugState((prev) => ({ ...prev, saving: false, lastError: err }))
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
      logo_url: logoUrl,
      updated_at: new Date().toISOString(),
    }

    if (payload.id) delete payload.id
    if (payload.created_at) delete payload.created_at

    setDebugState((prev) => ({ ...prev, payload }))

    try {
      console.log('--- SALVAR DADOS DA EMPRESA ---')
      console.log('Payload Enviado:', payload)

      const { data, error } = await supabase
        .from('company_settings' as any)
        .upsert(payload, { onConflict: 'loja_id' })
        .select()

      console.log('Resposta do Supabase:', data)

      if (error) throw error

      setDebugState((prev) => ({
        ...prev,
        response: data,
        saving: false,
        lastSuccess: 'Dados da empresa salvos no Supabase com sucesso!',
      }))

      toast({ title: 'Dados da empresa salvos com sucesso' })
      await fetchSettings()
    } catch (e: any) {
      console.error('Exception ao salvar:', e)
      setDebugState((prev) => ({
        ...prev,
        saving: false,
        lastError: e.message || JSON.stringify(e),
      }))
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

        const { data, error } = await supabase
          .from('company_settings' as any)
          .upsert(logoPayload, { onConflict: 'loja_id' })
          .select()

        setDebugState((prev) => ({
          ...prev,
          payload: logoPayload,
          response: data,
          lastError: error ? error.message : null,
          lastSuccess: error ? null : 'Logo salva no Supabase.',
        }))
      }
      setLogoUrl(publicUrl)
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

      const { data, error } = await supabase
        .from('company_settings' as any)
        .upsert(payload, { onConflict: 'loja_id' })
        .select()

      setDebugState((prev) => ({
        ...prev,
        payload,
        response: data,
        lastError: error ? error.message : null,
        lastSuccess: error ? null : 'Logo removida com sucesso no Supabase.',
      }))

      if (error) throw error
      setLogoUrl(null)
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
              {logoUrl ? (
                <img
                  src={logoUrl}
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
                {!logoUrl ? (
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

        <div className="mt-8 p-4 bg-slate-900 text-green-400 rounded-lg overflow-auto text-xs font-mono">
          <h4 className="text-white font-bold mb-2 border-b border-green-800 pb-2">
            DEBUG SALVAMENTO:
          </h4>
          <div className="space-y-2">
            <div>
              <strong className="text-white">Botão clicado:</strong>{' '}
              {debugState.clicked ? 'Sim' : 'Não'}
            </div>
            <div>
              <strong className="text-white">Salvando:</strong>{' '}
              {debugState.saving ? 'Sim' : 'Não'}
            </div>
            <div>
              <strong className="text-white">Último erro:</strong>{' '}
              {debugState.lastError ? (
                <span className="text-red-400">{debugState.lastError}</span>
              ) : (
                'Nenhum'
              )}
            </div>
            <div>
              <strong className="text-white">Último sucesso:</strong>{' '}
              {debugState.lastSuccess || 'Nenhum'}
            </div>
            {debugState.payload && (
              <div className="pt-2 border-t border-green-900 mt-2">
                <strong className="text-white">Payload Enviado:</strong>
                <pre className="mt-1 whitespace-pre-wrap text-green-300 bg-black bg-opacity-30 p-2 rounded">
                  {JSON.stringify(debugState.payload, null, 2)}
                </pre>
              </div>
            )}
            {debugState.response && (
              <div className="pt-2">
                <strong className="text-white">Resposta Supabase:</strong>
                <pre className="mt-1 whitespace-pre-wrap text-green-300 bg-black bg-opacity-30 p-2 rounded">
                  {JSON.stringify(debugState.response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
