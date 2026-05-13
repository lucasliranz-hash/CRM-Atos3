import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export default function DebugSupabase() {
  const { user, profile, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, any>>({})
  const [connTest, setConnTest] = useState<any>(null)
  const [bypassTest, setBypassTest] = useState<any>(null)

  const runQueries = async () => {
    setLoading(true)
    const tables = [
      'accounts',
      'contacts',
      'opportunities',
      'activities',
      'proposals',
    ]
    const res: Record<string, any> = {}

    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table as any)
        .select('*', { count: 'exact' })
      res[table] = {
        total: count ?? (data ? data.length : 0),
        data: data ? data.slice(0, 5) : [],
        error,
      }
    }
    setResults(res)
    setLoading(false)
  }

  useEffect(() => {
    if (!authLoading) {
      runQueries()
    }
  }, [authLoading])

  const handleTestConnection = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    setConnTest({ data, error })
  }

  const handleBypassRLS = async () => {
    const { data, error } = await supabase.from('accounts').select('*').limit(5)
    setBypassTest({ data, error })
  }

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'monospace',
        color: '#000',
        backgroundColor: '#fff',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        DEBUG SUPABASE
      </h1>

      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h2>1. Usuário Logado</h2>
        {authLoading ? (
          <p>Carregando auth...</p>
        ) : (
          <pre style={{ fontSize: '14px' }}>
            auth.uid(): {user?.id ?? 'Não logado'}
            email: {user?.email ?? 'N/A'}
            role (auth): {user?.role ?? 'N/A'}
            profile.id: {profile?.id ?? 'N/A'}
            profile.role: {profile?.role ?? 'N/A'}
          </pre>
        )}
      </div>

      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h2>2. Referência do Pipeline</h2>
        <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          TABELA UTILIZADA PELO PIPELINE: accounts
        </p>
      </div>

      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h2>3. Ações Rápidas</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleTestConnection}
            style={{
              padding: '10px',
              cursor: 'pointer',
              border: '1px solid #000',
              background: '#eee',
            }}
          >
            Testar conexão Supabase
          </button>

          {(profile?.role === 'admin' || profile?.role === 'gestor') && (
            <button
              onClick={handleBypassRLS}
              style={{
                padding: '10px',
                cursor: 'pointer',
                border: '1px solid #000',
                background: '#ffcccc',
              }}
            >
              Bypass temporário RLS
            </button>
          )}
        </div>

        {connTest && (
          <div
            style={{
              background: '#f5f5f5',
              padding: '10px',
              marginTop: '10px',
              border: '1px solid #ddd',
            }}
          >
            <strong>Resultado Conexão:</strong>
            <pre>{JSON.stringify(connTest, null, 2)}</pre>
          </div>
        )}

        {bypassTest && (
          <div
            style={{
              background: '#f5f5f5',
              padding: '10px',
              marginTop: '10px',
              border: '1px solid #ddd',
            }}
          >
            <strong>Resultado Bypass RLS (accounts limit 5):</strong>
            <pre>{JSON.stringify(bypassTest, null, 2)}</pre>
          </div>
        )}
      </div>

      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        <h2>4. Consultas Reais ({loading ? 'CARREGANDO...' : 'CONCLUÍDO'})</h2>

        {[
          'accounts',
          'contacts',
          'opportunities',
          'activities',
          'proposals',
        ].map((table) => {
          const res = results[table]
          if (!res) return null

          return (
            <div
              key={table}
              style={{
                border: '1px dashed #999',
                margin: '15px 0',
                padding: '15px',
                background: '#fafafa',
              }}
            >
              <h3
                style={{
                  textTransform: 'uppercase',
                  margin: '0 0 10px 0',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px',
                }}
              >
                {table}
              </h3>
              <p style={{ fontSize: '1.2em' }}>
                <strong>Total:</strong> {res.total}
              </p>

              <div style={{ marginBottom: '10px' }}>
                <strong>Erro: </strong>
                {res.error ? (
                  <pre
                    style={{
                      color: '#d00',
                      background: '#ffe6e6',
                      padding: '10px',
                      border: '1px solid #fcc',
                      marginTop: '5px',
                    }}
                  >
                    {JSON.stringify(res.error, null, 2)}
                  </pre>
                ) : (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                    null
                  </span>
                )}
              </div>

              <div>
                <strong>Primeiros registros:</strong>
                {res.data && res.data.length > 0 ? (
                  <pre
                    style={{
                      background: '#fff',
                      padding: '10px',
                      border: '1px solid #eee',
                      maxHeight: '400px',
                      overflow: 'auto',
                      marginTop: '5px',
                    }}
                  >
                    {JSON.stringify(res.data, null, 2)}
                  </pre>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Nenhum registro retornado.
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
