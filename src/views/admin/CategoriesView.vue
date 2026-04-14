<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-gray-900">Expense Tracker — Categories</h1>
      <button
        @click="showCreate = !showCreate"
        class="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
      >
        {{ showCreate ? 'Cancel' : 'Add category' }}
      </button>
    </div>

    <div v-if="showCreate" class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-3">Add a new category</h2>
      <form @submit.prevent="submitCreate" class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input v-model="form.name" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
          <input v-model="form.description" class="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        </div>
        <div v-if="formError" class="text-sm text-red-600">{{ formError }}</div>
        <button type="submit" :disabled="saving" class="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
          {{ saving ? 'Saving…' : 'Create category' }}
        </button>
      </form>
    </div>

    <div v-if="loading" class="text-sm text-gray-500">Loading categories…</div>
    <div v-else-if="error" class="text-sm text-red-600">{{ error }}</div>
    <table v-else class="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
      <thead class="bg-gray-50">
        <tr class="text-left text-xs font-semibold text-gray-600 uppercase">
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Description</th>
          <th class="px-4 py-2">Status</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categories" :key="c.id" class="border-t border-gray-100">
          <td class="px-4 py-2">{{ c.name }}</td>
          <td class="px-4 py-2 text-gray-600">{{ c.description || '—' }}</td>
          <td class="px-4 py-2">
            <span :class="c.is_active ? 'text-green-700' : 'text-gray-400'">
              {{ c.is_active ? 'Active' : 'Disabled' }}
            </span>
          </td>
          <td class="px-4 py-2">
            <button @click="toggle(c)" class="text-xs text-indigo-600 hover:underline">
              {{ c.is_active ? 'Deactivate' : 'Activate' }}
            </button>
          </td>
        </tr>
        <tr v-if="!categories.length">
          <td colspan="4" class="px-4 py-6 text-center text-gray-400">No categories yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { expenseApi } from '@/api/expenseApi'
import type { Category } from '@/types/expense'

const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref('')
const showCreate = ref(false)
const saving = ref(false)
const formError = ref('')

const form = reactive({ name: '', description: '' })

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await expenseApi.getCategories()
    categories.value = res.data.data
  } catch {
    error.value = 'Failed to load categories.'
  } finally {
    loading.value = false
  }
}

async function submitCreate() {
  saving.value = true
  formError.value = ''
  try {
    await expenseApi.createCategory(form.name, form.description)
    form.name = ''
    form.description = ''
    showCreate.value = false
    await load()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
    formError.value =
      err?.response?.data?.errors?.name?.[0] ||
      err?.response?.data?.message ||
      'Failed to create category.'
  } finally {
    saving.value = false
  }
}

async function toggle(c: Category) {
  try {
    await expenseApi.toggleCategory(c.id)
    await load()
  } catch {
    error.value = 'Failed to update category.'
  }
}

onMounted(load)
</script>
