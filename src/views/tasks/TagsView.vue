<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-semibold text-gray-900">Task Manager — Tags</h1>
      <button
        @click="showCreate = !showCreate"
        class="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
      >
        {{ showCreate ? 'Cancel' : 'Add tag' }}
      </button>
    </div>

    <div v-if="showCreate" class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-3">Add a new tag</h2>
      <form @submit.prevent="submitCreate" class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input v-model="form.name" required class="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        </div>
        <div v-if="formError" class="text-sm text-red-600">{{ formError }}</div>
        <button type="submit" :disabled="saving" class="bg-indigo-600 text-white text-sm px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
          {{ saving ? 'Saving…' : 'Create tag' }}
        </button>
      </form>
    </div>

    <div v-if="loading" class="text-sm text-gray-500">Loading tags…</div>
    <div v-else-if="error" class="text-sm text-red-600">{{ error }}</div>
    <div v-else class="bg-white border border-gray-200 rounded-lg p-4">
      <div v-if="!tags.length" class="text-sm text-gray-400 text-center py-6">No tags yet.</div>
      <div v-else class="flex flex-wrap gap-2">
        <span
          v-for="t in tags"
          :key="t.id"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-200"
        >
          {{ t.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { taskApi } from '@/api/taskApi'
import type { Tag } from '@/types/task'

const tags = ref<Tag[]>([])
const loading = ref(true)
const error = ref('')
const showCreate = ref(false)
const saving = ref(false)
const formError = ref('')

const form = reactive({ name: '' })

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await taskApi.getTags()
    tags.value = res.data.data
  } catch {
    error.value = 'Failed to load tags.'
  } finally {
    loading.value = false
  }
}

async function submitCreate() {
  saving.value = true
  formError.value = ''
  try {
    await taskApi.createTag(form.name)
    form.name = ''
    showCreate.value = false
    await load()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
    formError.value =
      err?.response?.data?.errors?.name?.[0] ||
      err?.response?.data?.message ||
      'Failed to create tag.'
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
