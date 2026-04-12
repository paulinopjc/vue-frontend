<template>
  <div class="max-w-xl">
    <form @submit.prevent="submit" class="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div v-if="error" class="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{{ error }}</div>

      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Title *</label>
        <input v-model="form.title" type="text" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <textarea v-model="form.description" rows="2" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
      </div>
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-600 mb-1">Amount (₱) *</label>
          <input v-model="form.amount" type="number" step="0.01" min="0" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
        </div>
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-600 mb-1">Date *</label>
          <input v-model="form.date" type="date" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Category *</label>
        <select v-model="form.category_id" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400">
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <p v-if="categoryError" class="text-xs text-red-500 mt-1">{{ categoryError }}</p>
      </div>

      <div class="flex gap-3 pt-2">
        <button type="submit" :disabled="saving" class="px-5 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
          {{ saving ? 'Creating…' : 'Create Expense' }}
        </button>
        <button type="button" @click="router.push('/expenses')" class="px-5 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExpensesStore } from '@/stores/expenses'
import { expenseApi } from '@/api/expenseApi'
import type { Category } from '@/types/expense'

const store = useExpensesStore()
const router = useRouter()
const categories = ref<Category[]>([])
const saving = ref(false)
const error = ref('')
const categoryError = ref('')

const form = ref({ title: '', description: '', amount: '', date: '', category_id: '' as number | '' })

onMounted(async () => {
  try {
    const res = await expenseApi.getCategories()
    categories.value = res.data.data
  } catch {
    categoryError.value = 'Could not load categories. Please refresh the page.'
  }
})

async function submit() {
  saving.value = true
  error.value = ''
  try {
    await store.createExpense(form.value as Parameters<typeof store.createExpense>[0])
    router.push('/expenses')
  } catch {
    error.value = 'Failed to create expense.'
  } finally {
    saving.value = false
  }
}
</script>
