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
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { BackupManager } from '@/components/BackupManager'
import { DatabaseDiagnostic } from '@/components/DatabaseDiagnostic'

export default function Settings() {
  const { profile } = useAuth()
  const { logoUrl, setLogoUrl } = useMainStore()
  const { toast } = useToast()

  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

      <DatabaseDiagnostic />

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

      <BackupManager />
    </div>
  )
}
