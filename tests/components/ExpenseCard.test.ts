import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpenseCard from '@/components/expenses/ExpenseCard.vue'
import type { Expense } from '@/types/expense'

const mockExpense: Expense = {
  id: 1,
  title: 'Team lunch',
  description: null,
  amount: '1500.00',
  date: '2026-04-10',
  status: 'pending',
  category: { id: 1, name: 'Meals' },
  user: { id: 1, name: 'Alice' },
  team: { id: 1, name: 'Engineering' },
  reviewer: null,
  reviewed_at: null,
  rejection_reason: null,
  receipts: [],
  created_at: '2026-04-10T00:00:00Z',
  updated_at: '2026-04-10T00:00:00Z',
}

describe('ExpenseCard', () => {
  it('renders expense title', () => {
    const wrapper = mount(ExpenseCard, { props: { expense: mockExpense } })
    expect(wrapper.text()).toContain('Team lunch')
  })

  it('renders formatted amount', () => {
    const wrapper = mount(ExpenseCard, { props: { expense: mockExpense } })
    expect(wrapper.text()).toContain('1,500.00')
  })

  it('renders expense date', () => {
    const wrapper = mount(ExpenseCard, { props: { expense: mockExpense } })
    expect(wrapper.text()).toContain('2026-04-10')
  })
})
