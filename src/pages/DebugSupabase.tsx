import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function DebugSupabase() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const [data, setData] = useState<any>({
    accounts: { total: 0, preview: [], error: null },
    contacts: { total: 0, preview: [], error: null },
    opportunities: { total: 0, preview: [], error: null },
    activities: { total: 0, preview: [], error: null },
    proposals: { total: 0, preview: [], error: null },
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const queries = [
        { name: 'accounts', req: supabase.from('accounts').select('*') },
        { name: 'contacts', req: supabase.from('contacts').select('*') },
        {
          name: 'opportunities',
          req: supabase.from('opportunities').select('*'),
        },
        { name: 'activities', req: supabase.from('activities').select('*') },
        {
          name: 'proposals',
          req: supabase.from('proposals' as any).select('*'),
        },
      ]

      const results = await Promise.all(queries.map((q) => q.req))

      const newData: any = {}
      results.forEach((res, i) => {
        const key = queries[i].name
        newData[key] = {
          total: res.data?.length || 0,
          preview: res.data?.slice(0, 5) || [],
          error: res.error,
        }
      })

      setData(newData)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const testConnection = async () => {
    setTestResult({ loading: true })
    const { data: testData, error: testError } = await supabase
      .from('accounts')
      .select('id, name')
      .limit(1)
    setTestResult({ data: testData, error: testError, loading: false })
  }

  const bypassRLS = async () => {
    setTestResult({ loading: true, bypass: true })
    const { data: testData, error: testError } = await supabase
      .from('accounts')
      .select('*')
      .limit(5)
    setTestResult({
      data: testData,
      error: testError,
      loading: false,
      bypass: true,
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-slate-900">DEBUG SUPABASE</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Informações de Sessão</h2>
        <div className="grid grid-cols-2 gap-4 text-sm font-mono bg-slate-100 p-4 rounded-md">
          <div>
            <strong>auth.uid():</strong> {user?.id || 'Não autenticado'}
          </div>
          <div>
            <strong>email:</strong> {user?.email || '-'}
          </div>
          <div>
            <strong>profile.id:</strong> {profile?.id || '-'}
          </div>
          <div>
            <strong>role:</strong> {profile?.role || '-'}
          </div>
          <div>
            <strong>loja_id:</strong> {profile?.loja_id || '-'}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Status do Pipeline</h2>
        <div className="text-lg font-bold text-blue-600 bg-blue-50 p-4 rounded-md border border-blue-100">
          TABELA UTILIZADA PELO PIPELINE: accounts
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={testConnection}
          disabled={loading || testResult?.loading}
        >
          {testResult?.loading && !testResult?.bypass
            ? 'Testando...'
            : 'Testar conexão Supabase'}
        </Button>
        <Button
          onClick={bypassRLS}
          variant="secondary"
          disabled={loading || testResult?.loading}
        >
          {testResult?.loading && testResult?.bypass
            ? 'Testando...'
            : 'Bypass temporário RLS (Select Limit 5)'}
        </Button>
        <Button onClick={loadData} variant="outline" disabled={loading}>
          {loading ? 'Recarregando...' : 'Recarregar Tudo'}
        </Button>
      </div>

      {testResult && !testResult.loading && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4">Resultado do Teste</h2>
          {testResult.error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md font-mono text-sm border border-red-200">
              <p>
                <strong>Code:</strong> {testResult.error.code}
              </p>
              <p>
                <strong>Message:</strong> {testResult.error.message}
              </p>
              <p>
                <strong>Details:</strong> {testResult.error.details}
              </p>
            </div>
          ) : (
            <pre className="bg-green-50 text-green-800 p-4 rounded-md font-mono text-sm overflow-auto max-h-60 border border-green-200">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(data).map(([tableName, tableData]: any) => (
          <div
            key={tableName}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
          >
            <h2 className="text-xl font-bold mb-2 capitalize">{tableName}</h2>
            <div className="mb-4 text-sm font-medium text-slate-600">
              Total:{' '}
              <span className="font-bold text-slate-900">
                {tableData.total}
              </span>{' '}
              | Erro:{' '}
              {tableData.error ? (
                <span className="text-red-500 font-bold ml-1">Sim</span>
              ) : (
                <span className="text-green-500 font-bold ml-1">null</span>
              )}
            </div>

            {tableData.error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 font-mono text-sm border border-red-200">
                <p>
                  <strong>Code:</strong> {tableData.error.code}
                </p>
                <p>
                  <strong>Message:</strong> {tableData.error.message}
                </p>
                <p>
                  <strong>Details:</strong> {tableData.error.details}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">
                Primeiros registros:
              </h3>
              {tableData.preview.length > 0 ? (
                <ul className="list-disc pl-5 font-mono text-sm space-y-1 bg-slate-50 p-4 rounded-md border border-slate-100">
                  {tableData.preview.map((item: any) => (
                    <li key={item.id}>
                      {item.name || item.companyName || item.title || item.id}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-slate-400 italic">
                  Nenhum registro encontrado.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
