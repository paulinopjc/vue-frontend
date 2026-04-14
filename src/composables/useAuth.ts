import { computed } from 'vue'
import { useTaskAuthStore } from '@/stores/taskAuth'
import { useExpenseAuthStore } from '@/stores/expenseAuth'

export function useTaskAuth() {
  const store = useTaskAuthStore()
  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => !!store.token),
    isAdmin: computed(() => store.user?.role === 'admin'),
    loginWithGoogle: store.loginWithGoogle,
    logout: store.logout,
    refreshUser: store.refreshUser,
  }
}

export function useExpenseAuth() {
  const store = useExpenseAuthStore()
  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => !!store.token),
    isAdmin: computed(() => store.user?.role === 'admin'),
    loginWithGoogle: store.loginWithGoogle,
    logout: store.logout,
    refreshUser: store.refreshUser,
  }
}
