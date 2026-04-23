import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useMainStore from '@/stores/main'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  Calendar,
  Link2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Settings() {
  const { profile, user } = useAuth()
  const { logoUrl, setLogoUrl } = useMainStore()
  const { toast } = useToast()

  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<'geral' | 'integracoes'>('geral')
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(true)

  useEffect(() => {
    if (user) {
      checkGoogleIntegration()

      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code) {
        handleGoogleCallback(code)
      }
    } else {
      setLoadingGoogle(false)
    }
  }, [user])

  const checkGoogleIntegration = async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('user_integrations' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .maybeSingle()

      if (data) setIsGoogleConnected(true)
    } catch (err) {
      console.error('Error checking integration:', err)
    } finally {
      setLoadingGoogle(false)
    }
  }

  const handleGoogleCallback = async (code: string) => {
    setLoadingGoogle(true)
    try {
      const { data, error } = await supabase.functions.invoke(
        'google-calendar',
        {
          body: { action: 'exchangeCode', payload: { code } },
        },
      )
      if (error) throw error

      window.history.replaceState({}, document.title, window.location.pathname)
      setIsGoogleConnected(true)
      setActiveTab('integracoes')
      toast({ title: 'Google Agenda conectado com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao conectar',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoadingGoogle(false)
    }
  }

  const handleConnectGoogle = async () => {
    try {
      setLoadingGoogle(true)
      const { data, error } = await supabase.functions.invoke(
        'google-calendar',
        {
          body: { action: 'getAuthUrl' },
        },
      )
      if (error) throw error
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      toast({
        title: 'Erro de integração',
        description: err.message,
        variant: 'destructive',
      })
      setLoadingGoogle(false)
    }
  }

  const handleDisconnectGoogle = async () => {
    if (!user) return
    try {
      setLoadingGoogle(true)
      await supabase
        .from('user_integrations' as any)
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'google')
      setIsGoogleConnected(false)
      toast({ title: 'Integração desconectada' })
    } catch (err: any) {
      toast({
        title: 'Erro ao desconectar',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoadingGoogle(false)
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
        const { error: dbError } = await supabase
          .from('company_settings' as any)
          .upsert(
            {
              loja_id: profile.loja_id,
              logo_url: publicUrl,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'loja_id' },
          )

        if (dbError) throw dbError
      }

      setLogoUrl(publicUrl)
      toast({ title: 'Logo atualizada com sucesso!' })
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer upload',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-black text-black tracking-tight">
          Configurações
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Personalize a experiência, identidade e integrações do seu CRM.
        </p>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('geral')}
          className={cn(
            'px-4 py-2 text-sm font-bold border-b-2 transition-colors',
            activeTab === 'geral'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black',
          )}
        >
          Geral
        </button>
        <button
          onClick={() => setActiveTab('integracoes')}
          className={cn(
            'px-4 py-2 text-sm font-bold border-b-2 transition-colors',
            activeTab === 'integracoes'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black',
          )}
        >
          Integrações
        </button>
      </div>

      {activeTab === 'geral' && (
        <Card className="max-w-xl shadow-sm border-gray-200 bg-white animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              Identidade Visual
            </CardTitle>
            <CardDescription>
              Faça o upload da logo da sua empresa para exibir no cabeçalho do
              sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-colors">
              {logoUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={logoUrl}
                    alt="Logo Atual"
                    className="h-16 w-auto object-contain bg-white p-2 rounded shadow-sm border border-gray-200"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="font-bold border-gray-300"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Trocar Logo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="h-12 w-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-2">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    Nenhuma logo configurada
                  </p>
                  <p className="text-xs text-gray-500 font-medium mb-4">
                    PNG, JPG ou SVG (Recomendado: fundo transparente)
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-black text-white font-bold"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Fazer Upload
                  </Button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'integracoes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                Google Agenda & Meet
              </CardTitle>
              <CardDescription>
                Conecte sua conta do Google para gerar links de reuniões online
                automaticamente e sincronizar compromissos com a sua agenda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingGoogle ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">
                    Verificando status...
                  </span>
                </div>
              ) : isGoogleConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span className="text-sm font-bold">
                      Conta Google Conectada
                    </span>
                  </div>
                  <Button
                    onClick={handleDisconnectGoogle}
                    variant="outline"
                    className="w-full font-bold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Desconectar Google
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">
                      Ao conectar, o CRM poderá criar eventos no seu calendário
                      e gerar links do Google Meet para reuniões com leads.
                    </p>
                  </div>
                  <Button
                    onClick={handleConnectGoogle}
                    className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold flex items-center justify-center"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Conectar Google Agenda
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
