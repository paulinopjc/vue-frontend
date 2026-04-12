import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tasks' },

    // Task Manager — public
    { path: '/tasks/login', component: () => import('@/views/LoginView.vue'), meta: { app: 'task' } },
    { path: '/tasks/register', component: () => import('@/views/RegisterView.vue'), meta: { app: 'task' } },

    // Task Manager — protected
    { path: '/tasks', component: () => import('@/views/tasks/TaskListView.vue'), meta: { requiresTaskAuth: true, title: 'Tasks' } },
    { path: '/tasks/create', component: () => import('@/views/tasks/TaskCreateView.vue'), meta: { requiresTaskAuth: true, title: 'New Task' } },
    { path: '/tasks/:id/edit', component: () => import('@/views/tasks/TaskEditView.vue'), meta: { requiresTaskAuth: true, title: 'Edit Task' } },

    // Expense Tracker — public
    { path: '/expenses/login', component: () => import('@/views/LoginView.vue'), meta: { app: 'expense' } },
    { path: '/expenses/register', component: () => import('@/views/RegisterView.vue'), meta: { app: 'expense' } },

    // Expense Tracker — protected
    { path: '/expenses', component: () => import('@/views/expenses/ExpenseListView.vue'), meta: { requiresExpenseAuth: true, title: 'Expenses' } },
    { path: '/expenses/create', component: () => import('@/views/expenses/ExpenseCreateView.vue'), meta: { requiresExpenseAuth: true, title: 'New Expense' } },
    { path: '/expenses/reports', component: () => import('@/views/expenses/ReportsView.vue'), meta: { requiresExpenseAuth: true, title: 'Reports' } },
    { path: '/expenses/:id', component: () => import('@/views/expenses/ExpenseDetailView.vue'), meta: { requiresExpenseAuth: true, title: 'Expense Detail' } },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresTaskAuth) {
    const token = localStorage.getItem('task_token')
    if (!token) return '/tasks/login'
  }
  if (to.meta.requiresExpenseAuth) {
    const token = localStorage.getItem('expense_token')
    if (!token) return '/expenses/login'
  }
})

export default router
