import { computed } from 'vue'
import { useTaskAuthStore } from '@/stores/taskAuth'
import { useExpenseAuthStore } from '@/stores/expenseAuth'

export function useTaskAuth() {
  const store = useTaskAuthStore()
  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => !!store.token),
    login: store.login,
    logout: store.logout,
    register: store.register,
  }
}

export function useExpenseAuth() {
  const store = useExpenseAuthStore()
  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => !!store.token),
    login: store.login,
    logout: store.logout,
    register: store.register,
  }
}
