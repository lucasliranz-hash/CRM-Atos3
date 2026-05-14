import { useMemo } from 'react'
import useMainStore from '@/stores/main'
import {
  isAfter,
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns'

export type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all'
export interface ReportFilters {
  dateRange: DateRange
  responsible: string
  segment: string
  stage: string
}

export function useReportsData(filters: ReportFilters) {
  const { accounts, opportunities, activities, proposals } =
    useMainStore() as any

  return useMemo(() => {
    const now = new Date()
    let startDate = new Date(0)

    switch (filters.dateRange) {
      case 'today':
        startDate = startOfDay(now)
        break
      case 'week':
        startDate = startOfWeek(now)
        break
      case 'month':
        startDate = startOfMonth(now)
        break
      case 'quarter':
        startDate = startOfQuarter(now)
        break
      case 'year':
        startDate = startOfYear(now)
        break
    }

    const isDateInRange = (dateStr?: string | null) => {
      if (filters.dateRange === 'all') return true
      if (!dateStr) return false
      return isAfter(new Date(dateStr), startDate)
    }

    const isStageMatch = (stage?: string | null) => {
      if (filters.stage === 'all') return true
      return stage === filters.stage
    }

    const filteredAccounts = accounts.filter(
      (a) => isDateInRange(a.createdAt) && isStageMatch(a.pipelineStage),
    )
    const filteredOpps = opportunities.filter((o) => isDateInRange(o.createdAt))
    const filteredActivities = activities.filter((a) => isDateInRange(a.date))
    const filteredProposals = proposals.filter((p) =>
      isDateInRange(p.createdAt),
    )

    // KPIs
    const totalLeads = filteredAccounts.length
    const wonOpps = filteredOpps.filter((o) => o.stage === 'Fechado Ganho')
    const lostOpps = filteredOpps.filter((o) => o.stage === 'Fechado Perdido')
    const conversionRate =
      totalLeads > 0 ? (wonOpps.length / totalLeads) * 100 : 0
    const proposalsSent = filteredProposals.filter(
      (p) => p.status === 'Enviada',
    ).length
    const proposalsApproved = filteredProposals.filter(
      (p) => p.status === 'Aprovada',
    ).length
    const totalSales = wonOpps.length
    const mrr = wonOpps.reduce((acc, o) => acc + (o.mrr || 0), 0)
    const expectedRevenue = filteredOpps.reduce(
      (acc, o) => acc + (o.total || 0),
      0,
    )
    const ticketMedio = totalSales > 0 ? mrr / totalSales : 0
    const meetings = filteredActivities.filter((a) =>
      a.type.includes('Reunião'),
    ).length
    const negotiation = filteredOpps.filter(
      (o) => o.stage === 'Proposta' || o.stage === 'Em Conversa',
    ).length
    const delayedLeads = accounts.filter(
      (a: any) =>
        a.nextActionDate &&
        new Date(a.nextActionDate) < now &&
        a.pipelineStage !== 'Fechado' &&
        a.pipelineStage !== 'Perdido',
    ).length

    // Funnel Data
    const stages = [
      'Prospecção',
      'Contato realizado',
      'Reunião agendada',
      'Proposta enviada',
      'Negociação',
      'Fechado',
    ]
    const funnelData = stages.map((stage) => ({
      stage,
      count: filteredAccounts.filter(
        (a) => a.pipelineStage === stage || a.status === stage,
      ).length,
    }))

    // Source Data
    const sourceMap = filteredAccounts.reduce(
      (acc, lead) => {
        const src = lead.source || lead.leadSource || 'Outros'
        acc[src] = (acc[src] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const sourceData = Object.entries(sourceMap).map(([name, value]) => ({
      name,
      value,
    }))

    // Activity Performance
    const activityMap = filteredActivities.reduce(
      (acc, act) => {
        acc[act.type] = (acc[act.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const performanceData = Object.entries(activityMap).map(
      ([name, value]) => ({ name, value }),
    )

    // Insights
    const insights = []
    if (conversionRate < 10 && totalLeads > 0)
      insights.push('Sua conversão está abaixo de 10% no período selecionado.')
    if (delayedLeads > 5)
      insights.push(
        `Atenção: Você tem ${delayedLeads} leads atrasados ou sem follow-up na base geral.`,
      )
    if (proposalsApproved > 0)
      insights.push('Ótimo trabalho! Houve aprovação de propostas no período.')
    if (wonOpps.length > 0)
      insights.push(
        `Parabéns! Foram fechadas ${wonOpps.length} vendas no período selecionado.`,
      )

    return {
      kpis: {
        totalLeads,
        conversionRate,
        proposalsSent,
        proposalsApproved,
        totalSales,
        ticketMedio,
        expectedRevenue,
        mrr,
        lostLeads: lostOpps.length,
        meetings,
        delayedLeads,
        negotiation,
      },
      charts: { funnelData, sourceData, performanceData },
      tables: {
        leads: filteredAccounts,
        proposals: filteredProposals,
        activities: filteredActivities,
        opps: filteredOpps,
      },
      insights,
    }
  }, [accounts, opportunities, activities, proposals, filters])
}
