<template>
  <div class="max-w-xl">
    <LoadingSpinner v-if="loadingExpense" />
    <form v-else @submit.prevent="submit" class="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
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
      </div>

      <div class="flex gap-3 pt-2">
        <button type="submit" :disabled="saving" class="px-5 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
          {{ saving ? 'Saving…' : 'Save changes' }}
        </button>
        <button type="button" @click="router.push(`/expenses/${id}`)" class="px-5 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExpensesStore } from '@/stores/expenses'
import { expenseApi } from '@/api/expenseApi'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import type { Category } from '@/types/expense'

const route = useRoute()
const router = useRouter()
const store = useExpensesStore()

const id = Number(route.params.id)
const categories = ref<Category[]>([])
const loadingExpense = ref(true)
const saving = ref(false)
const error = ref('')

const form = ref({
  title: '',
  description: '',
  amount: '',
  date: '',
  category_id: '' as number | '',
})

onMounted(async () => {
  try {
    const [exp, cats] = await Promise.all([expenseApi.getExpense(id), expenseApi.getCategories()])
    const e = exp.data.data
    form.value = {
      title: e.title,
      description: e.description ?? '',
      amount: e.amount,
      date: e.date,
      category_id: e.category.id,
    }
    categories.value = cats.data.data
  } catch {
    error.value = 'Failed to load expense.'
  } finally {
    loadingExpense.value = false
  }
})

async function submit() {
  saving.value = true
  error.value = ''
  try {
    await store.updateExpense(id, {
      title: form.value.title,
      description: form.value.description || null,
      amount: form.value.amount,
      date: form.value.date,
      category_id: form.value.category_id as number,
    } as Parameters<typeof store.updateExpense>[1])
    router.push(`/expenses/${id}`)
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    error.value = err?.response?.data?.message || 'Failed to save changes.'
  } finally {
    saving.value = false
  }
}
</script>
