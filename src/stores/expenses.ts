import { defineStore } from 'pinia'
import { ref } from 'vue'
import { expenseApi } from '@/api/expenseApi'
import type { Expense, ExpenseFilters } from '@/types/expense'

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([])
  const current = ref<Expense | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nextCursor = ref<string | null>(null)

  async function fetchExpenses(filters: ExpenseFilters = {}, append = false) {
    loading.value = true
    error.value = null
    try {
      const params = { ...filters, ...(append && nextCursor.value ? { cursor: nextCursor.value } : {}) }
      const res = await expenseApi.getExpenses(params)
      if (append) {
        expenses.value.push(...res.data.data)
      } else {
        expenses.value = res.data.data
      }
      nextCursor.value = res.data.next_cursor
    } catch {
      error.value = 'Failed to load expenses'
    } finally {
      loading.value = false
    }
  }

  async function fetchExpense(id: number) {
    loading.value = true
    try {
      const res = await expenseApi.getExpense(id)
      current.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function createExpense(payload: Partial<Expense>) {
    const res = await expenseApi.createExpense(payload)
    expenses.value.unshift(res.data.data)
    return res.data.data
  }

  async function updateExpense(id: number, payload: Partial<Expense>) {
    const res = await expenseApi.updateExpense(id, payload)
    const idx = expenses.value.findIndex((e) => e.id === id)
    if (idx !== -1) expenses.value[idx] = res.data.data
    if (current.value?.id === id) current.value = res.data.data
    return res.data.data
  }

  async function deleteExpense(id: number) {
    await expenseApi.deleteExpense(id)
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  async function submitExpense(id: number) {
    const res = await expenseApi.submitExpense(id)
    _updateInList(res.data.data)
    return res.data.data
  }

  async function approveExpense(id: number) {
    const res = await expenseApi.approveExpense(id)
    _updateInList(res.data.data)
    return res.data.data
  }

  async function rejectExpense(id: number, reason: string) {
    const res = await expenseApi.rejectExpense(id, reason)
    _updateInList(res.data.data)
    return res.data.data
  }

  function _updateInList(expense: Expense) {
    const idx = expenses.value.findIndex((e) => e.id === expense.id)
    if (idx !== -1) expenses.value[idx] = expense
    if (current.value?.id === expense.id) current.value = expense
  }

  return {
    expenses, current, loading, error, nextCursor,
    fetchExpenses, fetchExpense, createExpense, updateExpense, deleteExpense,
    submitExpense, approveExpense, rejectExpense,
  }
})
