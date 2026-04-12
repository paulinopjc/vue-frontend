import { describe, it, expect, vi } from 'vitest'
import { useExpensesStore } from '@/stores/expenses'
import { expenseApi } from '@/api/expenseApi'

vi.mock('@/api/expenseApi', () => ({
  expenseApi: {
    getExpenses: vi.fn(),
    submitExpense: vi.fn(),
    approveExpense: vi.fn(),
    rejectExpense: vi.fn(),
    getExpense: vi.fn(),
    createExpense: vi.fn(),
    updateExpense: vi.fn(),
    deleteExpense: vi.fn(),
  },
}))

const mockExpense = {
  id: 1,
  title: 'Office Supplies',
  description: null,
  amount: '250.00',
  date: '2026-04-01',
  status: 'draft' as const,
  category: { id: 1, name: 'Office' },
  user: { id: 1, name: 'Alice' },
  team: { id: 1, name: 'Team A' },
  reviewer: null,
  reviewed_at: null,
  rejection_reason: null,
  receipts: [],
  created_at: '2026-04-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
}

describe('expenses store', () => {
  it('fetchExpenses populates the expenses list', async () => {
    vi.mocked(expenseApi.getExpenses).mockResolvedValue({
      data: { data: [mockExpense], next_cursor: null },
    } as never)

    const store = useExpensesStore()
    await store.fetchExpenses()
    expect(store.expenses).toHaveLength(1)
    expect(store.expenses[0].title).toBe('Office Supplies')
  })

  it('submitExpense updates expense status to pending', async () => {
    vi.mocked(expenseApi.getExpenses).mockResolvedValue({
      data: { data: [mockExpense], next_cursor: null },
    } as never)
    vi.mocked(expenseApi.submitExpense).mockResolvedValue({
      data: { data: { ...mockExpense, status: 'pending' } },
    } as never)

    const store = useExpensesStore()
    await store.fetchExpenses()
    await store.submitExpense(1)
    expect(store.expenses[0].status).toBe('pending')
  })

  it('approveExpense updates expense status to approved', async () => {
    vi.mocked(expenseApi.getExpenses).mockResolvedValue({
      data: { data: [{ ...mockExpense, status: 'pending' }], next_cursor: null },
    } as never)
    vi.mocked(expenseApi.approveExpense).mockResolvedValue({
      data: { data: { ...mockExpense, status: 'approved' } },
    } as never)

    const store = useExpensesStore()
    await store.fetchExpenses()
    await store.approveExpense(1)
    expect(store.expenses[0].status).toBe('approved')
  })
})
