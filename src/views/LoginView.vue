<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 w-full max-w-sm">
      <h2 class="text-lg font-semibold text-gray-900 mb-1">Sign in</h2>
      <p class="text-sm text-gray-500 mb-6">
        Use your authorized Google account to access Task Manager and Expense Tracker.
      </p>

      <div v-if="error" class="mb-4 text-sm text-red-600 bg-red-50 rounded px-3 py-2">{{ error }}</div>

      <div v-if="loading" class="mb-4 text-sm text-gray-500">Signing in&hellip;</div>

      <div class="flex justify-center">
        <GoogleSignInButton @success="handleCredential" @error="handleError" />
      </div>

      <div class="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-1">
        <p v-if="taskAuth.isAuthenticated.value" class="text-green-700">
          Task Manager: signed in as {{ taskAuth.user.value?.name }}
        </p>
        <p v-if="expenseAuth.isAuthenticated.value" class="text-green-700">
          Expense Tracker: signed in as {{ expenseAuth.user.value?.name }}
        </p>
        <p v-if="!taskAuth.isAuthenticated.value && taskFailed" class="text-amber-700">
          Task Manager: {{ taskAuth.user.value ? '' : (taskAuthStore.error || 'No access') }}
        </p>
        <p v-if="!expenseAuth.isAuthenticated.value && expenseFailed" class="text-amber-700">
          Expense Tracker: {{ expenseAuthStore.error || 'No access' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleSignInButton, type CredentialResponse } from 'vue3-google-signin'
import { useTaskAuthStore } from '@/stores/taskAuth'
import { useExpenseAuthStore } from '@/stores/expenseAuth'
import { useTaskAuth, useExpenseAuth } from '@/composables/useAuth'

const router = useRouter()
const taskAuthStore = useTaskAuthStore()
const expenseAuthStore = useExpenseAuthStore()
const taskAuth = useTaskAuth()
const expenseAuth = useExpenseAuth()

const loading = ref(false)
const taskFailed = ref(false)
const expenseFailed = ref(false)

const error = computed(() => {
  if (taskAuth.isAuthenticated.value || expenseAuth.isAuthenticated.value) return null
  if (!taskFailed.value && !expenseFailed.value) return null
  return 'Your Google account is not authorized for either app. Ask an administrator to add your email.'
})

async function handleCredential(response: CredentialResponse) {
  if (!response.credential) {
    taskFailed.value = true
    expenseFailed.value = true
    return
  }

  loading.value = true
  taskFailed.value = false
  expenseFailed.value = false

  const [taskOk, expenseOk] = await Promise.all([
    taskAuthStore.loginWithGoogle(response.credential),
    expenseAuthStore.loginWithGoogle(response.credential),
  ])

  taskFailed.value = !taskOk
  expenseFailed.value = !expenseOk
  loading.value = false

  if (taskOk) {
    router.push('/tasks')
  } else if (expenseOk) {
    router.push('/expenses')
  }
}

function handleError() {
  taskFailed.value = true
  expenseFailed.value = true
  loading.value = false
}
</script>
