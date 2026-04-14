import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tasks' },

    // Unified login (works for both apps)
    { path: '/login', component: () => import('@/views/LoginView.vue') },

    // Legacy login URLs redirect to the unified login
    { path: '/tasks/login', redirect: '/login' },
    { path: '/expenses/login', redirect: '/login' },

    // Task Manager — protected
    { path: '/tasks', component: () => import('@/views/tasks/TaskListView.vue'), meta: { requiresTaskAuth: true, title: 'Tasks' } },
    { path: '/tasks/create', component: () => import('@/views/tasks/TaskCreateView.vue'), meta: { requiresTaskAuth: true, title: 'New Task' } },
    { path: '/tasks/:id/edit', component: () => import('@/views/tasks/TaskEditView.vue'), meta: { requiresTaskAuth: true, title: 'Edit Task' } },
    { path: '/tasks/tags', component: () => import('@/views/tasks/TagsView.vue'), meta: { requiresTaskAuth: true, title: 'Tags' } },
    { path: '/tasks/admin/users', component: () => import('@/views/admin/TaskUsersView.vue'), meta: { requiresTaskAuth: true, requiresTaskAdmin: true, title: 'Users' } },

    // Expense Tracker — protected
    { path: '/expenses', component: () => import('@/views/expenses/ExpenseListView.vue'), meta: { requiresExpenseAuth: true, title: 'Expenses' } },
    { path: '/expenses/create', component: () => import('@/views/expenses/ExpenseCreateView.vue'), meta: { requiresExpenseAuth: true, title: 'New Expense' } },
    { path: '/expenses/reports', component: () => import('@/views/expenses/ReportsView.vue'), meta: { requiresExpenseAuth: true, title: 'Reports' } },
    { path: '/expenses/:id', component: () => import('@/views/expenses/ExpenseDetailView.vue'), meta: { requiresExpenseAuth: true, title: 'Expense Detail' } },
    { path: '/expenses/:id/edit', component: () => import('@/views/expenses/ExpenseEditView.vue'), meta: { requiresExpenseAuth: true, title: 'Edit Expense' } },
    { path: '/expenses/admin/users', component: () => import('@/views/admin/ExpenseUsersView.vue'), meta: { requiresExpenseAuth: true, requiresExpenseAdmin: true, title: 'Users' } },
    { path: '/expenses/admin/categories', component: () => import('@/views/admin/CategoriesView.vue'), meta: { requiresExpenseAuth: true, requiresExpenseAdmin: true, title: 'Categories' } },
    { path: '/expenses/admin/teams', component: () => import('@/views/admin/TeamsView.vue'), meta: { requiresExpenseAuth: true, requiresExpenseAdmin: true, title: 'Teams' } },
  ],
})

function readUser(key: string): { role?: string } | null {
  const stored = localStorage.getItem(key)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

router.beforeEach((to) => {
  if (to.meta.requiresTaskAuth) {
    if (!localStorage.getItem('task_token')) return '/login'
    if (to.meta.requiresTaskAdmin && readUser('task_user')?.role !== 'admin') return '/tasks'
  }
  if (to.meta.requiresExpenseAuth) {
    if (!localStorage.getItem('expense_token')) return '/login'
    if (to.meta.requiresExpenseAdmin && readUser('expense_user')?.role !== 'admin') return '/expenses'
  }
})

export default router
