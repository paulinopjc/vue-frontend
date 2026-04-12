<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
      <h2 class="text-lg font-semibold text-gray-900 mb-1">
        Create account — {{ isTask ? 'Task Manager' : 'Expense Tracker' }}
      </h2>
      <p class="text-sm text-gray-500 mb-6">Fill in your details to register</p>

      <div v-if="error" class="mb-4 text-sm text-red-600 bg-red-50 rounded px-3 py-2">{{ error }}</div>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input v-model="name" type="text" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
          <input v-model="passwordConfirmation" type="password" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
        </div>
        <button type="submit" :disabled="loading" class="w-full py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          {{ loading ? 'Registering…' : 'Register' }}
        </button>
      </form>
      <p class="text-xs text-center text-gray-400 mt-4">
        Already have an account?
        <router-link :to="isTask ? '/tasks/login' : '/expenses/login'" class="text-indigo-600 hover:underline">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskAuthStore } from '@/stores/taskAuth'
import { useExpenseAuthStore } from '@/stores/expenseAuth'

const route = useRoute()
const router = useRouter()
const isTask = computed(() => route.meta.app === 'task')

const taskAuth = useTaskAuthStore()
const expenseAuth = useExpenseAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    if (isTask.value) {
      await taskAuth.register(name.value, email.value, password.value, passwordConfirmation.value)
      router.push('/tasks')
    } else {
      await expenseAuth.register(name.value, email.value, password.value, passwordConfirmation.value)
      router.push('/expenses')
    }
  } catch {
    error.value = 'Registration failed. Check your details and try again.'
  } finally {
    loading.value = false
  }
}
</script>
