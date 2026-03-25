import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Crosshair } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await signIn(email, password)

    if (error) {
      toast({
        title: 'Erro ao entrar',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      navigate('/')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center text-white mb-4 shadow-md">
            <Crosshair className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Atos3 CRM
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium text-center">
            Acesso ao painel operacional B2B
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">E-mail</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Senha</label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-black text-white font-bold h-11"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar no Painel'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/signup" className="font-bold text-black hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
