import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface DashboardData {
  accounts: any[]
  activities: any[]
  proposals: any[]
  orders: any[]
  opportunities: any[]
  monthly_goals: any[]
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    accounts: [],
    activities: [],
    proposals: [],
    orders: [],
    opportunities: [],
    monthly_goals: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDashboardMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [
        { data: accounts, error: accErr },
        { data: activities, error: actErr },
        { data: proposals, error: propErr },
        { data: orders, error: ordErr },
        { data: opportunities, error: oppErr },
        { data: monthly_goals, error: goalsErr },
      ] = await Promise.all([
        supabase.from('accounts').select('*'),
        supabase.from('activities').select('*'),
        supabase.from('proposals').select('*'),
        supabase.from('order_forms').select('*'),
        supabase.from('opportunities').select('*'),
        supabase.from('monthly_goals').select('*'),
      ])

      if (accErr) throw accErr
      if (actErr) throw actErr
      if (propErr) throw propErr
      if (ordErr) throw ordErr
      if (oppErr) throw oppErr
      if (goalsErr) throw goalsErr

      setData({
        accounts: accounts || [],
        activities: activities || [],
        proposals: proposals || [],
        orders: orders || [],
        opportunities: opportunities || [],
        monthly_goals: monthly_goals || [],
      })
    } catch (err: any) {
      console.error('Dashboard fetch error:', err)
      setError(err.message || 'Erro ao carregar dados do Supabase')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getDashboardMetrics()
  }, [getDashboardMetrics])

  return {
    data,
    loading,
    error,
    refresh: getDashboardMetrics,
    getDashboardMetrics,
  }
}
