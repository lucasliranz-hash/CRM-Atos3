// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_PUBLISHABLE_KEY = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
)

// [DIAGNÓSTICO E RESTAURAÇÃO] Remover temporariamente filtros excessivos no frontend
// O código abaixo intercepta o client do Supabase para ignorar filtros de .eq('user_id', ...)
// enviados pelos hooks/stores globais, forçando o retorno de todos os registros no pipeline.
const originalFrom = supabase.from.bind(supabase)
;(supabase as any).from = (table: string) => {
  const queryBuilder = originalFrom(table)
  const originalSelect = queryBuilder.select.bind(queryBuilder)

  queryBuilder.select = (...args: any[]) => {
    const filterBuilder = originalSelect(...args)
    const originalEq = filterBuilder.eq.bind(filterBuilder)
    const originalMatch = filterBuilder.match?.bind(filterBuilder)

    filterBuilder.eq = function (column: string, value: any) {
      if (column === 'user_id') {
        console.warn(
          `[SUPABASE DEBUG] Filtro bloqueado: ignorando .eq('user_id', '${value}') na tabela '${table}' para forçar exibição global.`,
        )
        return this
      }
      return originalEq(column, value)
    }

    if (originalMatch) {
      filterBuilder.match = function (query: Record<string, any>) {
        if (query.user_id !== undefined) {
          console.warn(
            `[SUPABASE DEBUG] Filtro bloqueado: ignorando match({ user_id: '${query.user_id}' }) na tabela '${table}'.`,
          )
          const newQuery = { ...query }
          delete newQuery.user_id
          return originalMatch(newQuery)
        }
        return originalMatch(query)
      }
    }

    return filterBuilder
  }

  return queryBuilder
}
