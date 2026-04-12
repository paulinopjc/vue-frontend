export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface Category {
  id: number
  name: string
  description: string
  is_active: boolean
}

export interface Receipt {
  id: number
  original_name: string
  mime_type: string
  size: number
  created_at: string
}

export interface Comment {
  id: number
  body: string
  user: { id: number; name: string }
  created_at: string
}

export interface ExpenseUser {
  id: number
  name: string
}

export interface Expense {
  id: number
  title: string
  description: string | null
  amount: string
  date: string
  status: ExpenseStatus
  category: { id: number; name: string }
  user: ExpenseUser
  team: { id: number; name: string }
  reviewer: ExpenseUser | null
  reviewed_at: string | null
  rejection_reason: string | null
  receipts: Receipt[]
  created_at: string
  updated_at: string
}

export interface ExpenseFilters {
  status?: ExpenseStatus | ''
  category_id?: number | ''
  date_from?: string
  date_to?: string
}

export interface PaginatedExpenses {
  data: Expense[]
  next_cursor: string | null
}

export interface TeamSummaryItem {
  user_id: number
  name: string
  total: number
  count: number
}

export interface CategoryReportItem {
  category_id: number
  name: string
  total: number
  count: number
}

export interface MemberReportItem {
  user_id: number
  name: string
  total: number
  count: number
}
