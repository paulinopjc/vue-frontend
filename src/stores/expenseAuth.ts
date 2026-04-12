import { defineStore } from 'pinia'
import { ref } from 'vue'
import { expenseApi } from '@/api/expenseApi'
import type { User } from '@/types/auth'

const TOKEN_KEY = 'expense_token'
const USER_KEY = 'expense_user'

export const useExpenseAuthStore = defineStore('expenseAuth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  function loadFromStorage() {
    token.value = localStorage.getItem(TOKEN_KEY)
    const stored = localStorage.getItem(USER_KEY)
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch {
        localStorage.removeItem(USER_KEY)
        user.value = null
      }
    }
  }

  async function login(email: string, password: string) {
    const res = await expenseApi.login(email, password)
    if (!res.data.token) throw new Error('Login failed')
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem(TOKEN_KEY, res.data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
  }

  async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    const res = await expenseApi.register(name, email, password, passwordConfirmation)
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem(TOKEN_KEY, res.data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const isAuthenticated = () => !!token.value

  return { token, user, loadFromStorage, login, register, logout, isAuthenticated }
})
