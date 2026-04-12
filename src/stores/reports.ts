import { defineStore } from 'pinia'
import { ref } from 'vue'
import { expenseApi } from '@/api/expenseApi'
import type { TeamSummaryItem, CategoryReportItem, MemberReportItem } from '@/types/expense'

export const useReportsStore = defineStore('reports', () => {
  const teamSummary = ref<TeamSummaryItem[]>([])
  const byCategory = ref<CategoryReportItem[]>([])
  const byMember = ref<MemberReportItem[]>([])
  const loading = ref(false)

  async function fetchAll(params?: { date_from?: string; date_to?: string }) {
    loading.value = true
    try {
      const [summary, cat, member] = await Promise.all([
        expenseApi.getTeamSummary(params),
        expenseApi.getByCategory(params),
        expenseApi.getByMember(params),
      ])
      teamSummary.value = summary.data.data
      byCategory.value = cat.data.data
      byMember.value = member.data.data
    } finally {
      loading.value = false
    }
  }

  return { teamSummary, byCategory, byMember, loading, fetchAll }
})
