import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import useMainStore from '@/stores/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Database, CheckCircle2, AlertCircle } from 'lucide-react'

export function DatabaseDiagnostic() {
  const { user, profile } = useAuth()
  const { accounts, contacts } = useMainStore() as any
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runDiagnostic = async () => {
    setLoading(true)
    try {
      const diag: any = {
        user: {
          uid: user?.id,
          role: profile?.role || user?.role,
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

        if (error) {
          diag.errors[table] = error.message
          diag.counts[table] = 0
        } else {
          diag.counts[table] = count || 0
          diag.sample[table] = data?.slice(0, 5) || []
        }
      }

      setResults(diag)
      console.log('--- DEBUG SUPABASE (VISIBILIDADE DOS DADOS) ---', diag)
    } catch (err: any) {
      console.error('Erro geral no diagnóstico:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      runDiagnostic()
    }
  }, [user])

  return (
    <Card className="w-full shadow-sm border-orange-200 bg-orange-50/50 mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
      <CardHeader className="bg-orange-100/40 border-b border-orange-100 rounded-t-xl py-3 px-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-[13px] font-black flex items-center gap-2 text-orange-900 uppercase tracking-widest">
              <Database className="w-4 h-4 text-orange-600" />
              Diagnóstico e Restauração de Dados
            </CardTitle>
          </div>
          <Button
            onClick={runDiagnostic}
            disabled={loading}
            size="sm"
            variant="outline"
            className="h-8 bg-white border-orange-200 text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : null}
            Recarregar Diagnóstico
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {results ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm transition-all hover:border-orange-300">
              <h4 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-2.5">
                1. Usuário Atual
              </h4>
              <div className="space-y-2.5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    auth.uid()
                  </span>
                  <span className="font-mono text-[11px] truncate font-bold text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 mt-1">
                    {results.user.uid || 'Não logado'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Role Acesso
                  </span>
                  <span className="font-bold text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded uppercase">
                    {results.user.role || 'Sem role'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm transition-all hover:border-orange-300">
              <h4 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-2.5">
                2. Banco Supabase
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-[11px] uppercase">
                    Total Accounts:
                  </span>
                  <span className="font-black text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded">
                    {results.counts['accounts'] ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-[11px] uppercase">
                    Total Contacts:
                  </span>
                  <span className="font-black text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded">
                    {results.counts['contacts'] ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">
                    Amostra user_id:
                  </span>
                  <span
                    className="font-mono text-[10px] text-slate-500 truncate w-24 text-right"
                    title={results.sample['accounts']?.[0]?.user_id}
                  >
                    {results.sample['accounts']?.[0]?.user_id || 'NULL'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm transition-all hover:border-emerald-300">
              <h4 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-2.5">
                3. Store (Frontend)
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-[11px] uppercase">
                    Contas Carregadas:
                  </span>
                  <span className="font-black text-emerald-600 text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {accounts?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-[11px] uppercase">
                    Contatos Carregados:
                  </span>
                  <span className="font-black text-emerald-600 text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {contacts?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">
                    Tabela Pipeline:
                  </span>
                  <span className="font-bold text-[10px] text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    accounts
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col transition-all hover:border-red-300">
              <h4 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-2.5">
                4. Erros (Block/RLS)
              </h4>
              <div className="flex-1 overflow-auto custom-scrollbar">
                {Object.keys(results.errors).length > 0 ? (
                  <div className="space-y-1.5">
                    {Object.entries(results.errors).map(([t, e]: any) => (
                      <div
                        key={t}
                        className="flex flex-col gap-1 text-[10px] text-red-700 bg-red-50 p-2 rounded font-mono border border-red-100"
                      >
                        <span className="font-bold border-b border-red-100/50 pb-1 flex items-center">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" /> {t}
                        </span>
                        <span className="break-words leading-relaxed">{e}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mt-1 bg-emerald-50 p-2.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Sem bloqueios (RLS
                    Livre)
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm font-medium text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />{' '}
            Analisando sincronização entre Frontend e Banco...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
