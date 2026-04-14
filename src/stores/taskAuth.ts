import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskApi } from '@/api/taskApi'
import type { User } from '@/types/auth'

const TOKEN_KEY = 'task_token'
const USER_KEY = 'task_user'

export const useTaskAuthStore = defineStore('taskAuth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const error = ref<string | null>(null)

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

  async function loginWithGoogle(idToken: string): Promise<boolean> {
    error.value = null
    try {
      const res = await taskApi.loginWithGoogle(idToken)
      token.value = res.data.data.token
      user.value = res.data.data.user
      localStorage.setItem(TOKEN_KEY, res.data.data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.data.user))
      return true
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
      const msg =
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.message ||
        'Sign-in failed.'
      error.value = msg
      return false
    }
  }

  async function refreshUser() {
    if (!token.value) return
    try {
      const res = await taskApi.me()
      user.value = res.data.data
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.data))
    } catch {
      logout()
    }
  }

  async function logout() {
    if (token.value) {
      try {
        await taskApi.logout()
      } catch {
        // ignore — clear local state regardless
      }
    }
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const isAuthenticated = () => !!token.value
  const isAdmin = () => user.value?.role === 'admin'

  return { token, user, error, loadFromStorage, loginWithGoogle, refreshUser, logout, isAuthenticated, isAdmin }
})
