import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

export interface MonthlyGoal {
  id?: string
  month: string
  leadsGoal: number
  meetingsGoal: number
  proposalsGoal: number
  salesGoal: number
  loja_id?: string
  user_id?: string
}

export function useMonthlyGoals() {
  const { profile } = useAuth()
  const [goals, setGoals] = useState<MonthlyGoal[]>([])

  const loadGoals = useCallback(async () => {
    const local = localStorage.getItem('monthly_goals')
    if (local) {
      try {
        setGoals(JSON.parse(local))
      } catch {
        // ignore
      }
    }

    if (profile?.loja_id) {
      const { data, error } = await supabase
        .from('monthly_goals' as any)
        .select('*')
        .eq('loja_id', profile.loja_id)

      if (data && !error) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          month: d.month,
          leadsGoal: d.leads_goal,
          meetingsGoal: d.meetings_goal,
          proposalsGoal: d.proposals_goal,
          salesGoal: d.sales_goal,
          loja_id: d.loja_id,
          user_id: d.user_id,
        }))
        setGoals(mapped)
        localStorage.setItem('monthly_goals', JSON.stringify(mapped))
      }
    }
  }, [profile?.loja_id])

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const updateGoal = async (month: string, updates: Partial<MonthlyGoal>) => {
    const existing = goals.find((g) => g.month === month) || {
      month,
      leadsGoal: 100,
      meetingsGoal: 15,
      proposalsGoal: 8,
      salesGoal: 4,
    }

    const newGoal = { ...existing, ...updates }

    setGoals((prev) => {
      const filtered = prev.filter((g) => g.month !== month)
      const next = [...filtered, newGoal]
      localStorage.setItem('monthly_goals', JSON.stringify(next))
      return next
    })

    if (profile?.loja_id) {
      const dbPayload = {
        month: newGoal.month,
        leads_goal: newGoal.leadsGoal,
        meetings_goal: newGoal.meetingsGoal,
        proposals_goal: newGoal.proposalsGoal,
        sales_goal: newGoal.salesGoal,
        loja_id: profile.loja_id,
      }

      if (existing.id) {
        await supabase
          .from('monthly_goals' as any)
          .update(dbPayload)
          .eq('id', existing.id)
      } else {
        const { data } = await supabase
          .from('monthly_goals' as any)
          .insert(dbPayload)
          .select()
          .single()
        if (data) {
          loadGoals()
        }
      }
    }
  }

  return { goals, updateGoal, loadGoals }
}
