import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Database, AlertCircle, CheckCircle2 } from 'lucide-react'

export function DatabaseDiagnostic() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runDiagnostic = async () => {
    setLoading(true)
    try {
      const diag: any = {
        user: {
          uid: user?.id,
          email: user?.email,
          role: user?.role,
          profileId: profile?.id,
          profileRole: profile?.role,
        },
        counts: {},
        errors: {},
        sample: {},
      }

      const tables = [
        'accounts',
        'contacts',
        'opportunities',
        'activities',
        'proposals',
      ]

      for (const table of tables) {
        const { data, error, count } = await supabase
          .from(table as any)
          .select('id, user_id', { count: 'exact' })
          .limit(10)

        if (error) {
          diag.errors[table] = error.message
          diag.counts[table] = 0
        } else {
          diag.counts[table] = count || 0
          diag.sample[table] = data
        }
      }

      setResults(diag)

      console.log('--- DIAGNÓSTICO DO BANCO (TESTES) ---')
      console.log('1. Quantidade de registros:')
      tables.forEach((t) => console.log(`- ${t}: ${diag.counts[t]}`))

      console.log('\n2. Verificando user_id (10 primeiros registros):')
      tables.forEach((t) => {
        if (diag.sample[t] && diag.sample[t].length > 0) {
          console.log(`${t}:`, diag.sample[t])
        }
      })

      console.log('\n3. Usuário logado no frontend:')
      console.log('- auth.uid():', diag.user.uid)
      console.log('- email:', diag.user.email)
      console.log('- role (auth):', diag.user.role)
      console.log('- profile.id:', diag.user.profileId)
      console.log('- profile.role:', diag.user.profileRole)

      console.log('\n5. Erros de query no Supabase:')
      const errorKeys = Object.keys(diag.errors)
      if (errorKeys.length > 0) {
        errorKeys.forEach((t) => console.log(`- ${t} error:`, diag.errors[t]))
      } else {
        console.log('- Nenhum erro de query retornado.')
      }

      console.log('\n6. RLS na prática:')
      console.log(
        'Se os arrays de amostra acima retornaram vazio [] mesmo havendo contagem real no banco, o problema é RLS ou user_id não correspondente.',
      )
      console.log('-------------------------------------')
    } catch (err: any) {
      console.error('Erro geral no diagnóstico:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl shadow-sm border-gray-200 bg-white mb-6">
      <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
          <Database className="w-5 h-5 text-indigo-500" />
          Diagnóstico do Banco
        </CardTitle>
        <CardDescription className="text-slate-600">
          Validação técnica real das queries, RLS e propriedade dos dados
          (user_id).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <Button
          onClick={runDiagnostic}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Executar Validação Técnica
        </Button>

        {results && (
          <div className="space-y-4 text-sm mt-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                3. Usuário Logado
              </h4>
              <ul className="space-y-1 text-slate-600 mt-2">
                <li>
                  <strong>UID:</strong>{' '}
                  <span className="font-mono text-xs bg-white px-1 border rounded">
                    {results.user.uid || 'Não logado'}
                  </span>
                </li>
                <li>
                  <strong>E-mail:</strong> {results.user.email || '-'}
                </li>
                <li>
                  <strong>Profile Role:</strong>{' '}
                  <span className="font-bold text-indigo-600">
                    {results.user.profileRole || '-'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
                1 e 6. Tabelas (Contagem & RLS)
              </h4>
              <div className="mt-2 space-y-2">
                {Object.keys(results.counts).map((table) => {
                  const err = results.errors[table]
                  const count = results.counts[table]
                  return (
                    <div
                      key={table}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-700 capitalize">
                        {table}
                      </span>
                      {err ? (
                        <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3" /> {err}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> {count}{' '}
                          encontrados
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-xs font-medium">
              Abra o console do navegador (
              <kbd className="bg-amber-100 px-1 rounded">F12</kbd> ou{' '}
              <kbd className="bg-amber-100 px-1 rounded">Ctrl+Shift+I</kbd>)
              para ver os detalhes completos das queries, erros e a listagem de{' '}
              <strong>user_id</strong> de cada registro (Testes solicitados).
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
