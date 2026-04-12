import { createApiClient } from './client'
import type { AuthResponse } from '@/types/auth'
import type {
  Expense,
  Category,
  Receipt,
  Comment,
  PaginatedExpenses,
  ExpenseFilters,
  TeamSummaryItem,
  CategoryReportItem,
  MemberReportItem,
} from '@/types/expense'

const TOKEN_KEY = 'expense_token'
const client = createApiClient(import.meta.env.VITE_EXPENSE_API_URL, TOKEN_KEY)

export const expenseApi = {
  // Auth
  login(email: string, password: string): Promise<{ data: AuthResponse }> {
    return client.post('/login', { email, password })
  },
  register(name: string, email: string, password: string, password_confirmation: string): Promise<{ data: AuthResponse }> {
    return client.post('/register', { name, email, password, password_confirmation })
  },

  // Expenses
  getExpenses(params: ExpenseFilters & { cursor?: string } = {}): Promise<{ data: PaginatedExpenses }> {
    return client.get('/expenses', { params })
  },
  getExpense(id: number): Promise<{ data: { data: Expense } }> {
    return client.get(`/expenses/${id}`)
  },
  createExpense(payload: Partial<Expense>): Promise<{ data: { data: Expense } }> {
    return client.post('/expenses', payload)
  },
  updateExpense(id: number, payload: Partial<Expense>): Promise<{ data: { data: Expense } }> {
    return client.put(`/expenses/${id}`, payload)
  },
  deleteExpense(id: number): Promise<void> {
    return client.delete(`/expenses/${id}`)
  },

  // Workflow
  submitExpense(id: number): Promise<{ data: { data: Expense } }> {
    return client.post(`/expenses/${id}/submit`)
  },
  approveExpense(id: number): Promise<{ data: { data: Expense } }> {
    return client.post(`/expenses/${id}/approve`)
  },
  rejectExpense(id: number, rejection_reason: string): Promise<{ data: { data: Expense } }> {
    return client.post(`/expenses/${id}/reject`, { rejection_reason })
  },

  // Receipts
  uploadReceipt(expenseId: number, file: File): Promise<{ data: { data: Receipt } }> {
    const form = new FormData()
    form.append('file', file)
    return client.post(`/expenses/${expenseId}/receipts`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getReceipts(expenseId: number): Promise<{ data: { data: Receipt[] } }> {
    return client.get(`/expenses/${expenseId}/receipts`)
  },
  downloadReceipt(receiptId: number): Promise<{ data: Blob }> {
    return client.get(`/receipts/${receiptId}/download`, { responseType: 'blob' })
  },
  deleteReceipt(receiptId: number): Promise<void> {
    return client.delete(`/receipts/${receiptId}`)
  },

  // Comments
  addComment(expenseId: number, body: string): Promise<{ data: { data: Comment } }> {
    return client.post(`/expenses/${expenseId}/comments`, { body })
  },
  getComments(expenseId: number): Promise<{ data: { data: Comment[] } }> {
    return client.get(`/expenses/${expenseId}/comments`)
  },
  deleteComment(commentId: number): Promise<void> {
    return client.delete(`/comments/${commentId}`)
  },

  // Categories
  getCategories(): Promise<{ data: { data: Category[] } }> {
    return client.get('/categories')
  },
  createCategory(name: string, description: string): Promise<{ data: { data: Category } }> {
    return client.post('/categories', { name, description })
  },

  // Reports
  getTeamSummary(params?: { date_from?: string; date_to?: string }): Promise<{ data: { data: TeamSummaryItem[] } }> {
    return client.get('/reports/team-summary', { params })
  },
  getByCategory(params?: { date_from?: string; date_to?: string }): Promise<{ data: { data: CategoryReportItem[] } }> {
    return client.get('/reports/by-category', { params })
  },
  getByMember(params?: { date_from?: string; date_to?: string }): Promise<{ data: { data: MemberReportItem[] } }> {
    return client.get('/reports/by-member', { params })
  },
}
