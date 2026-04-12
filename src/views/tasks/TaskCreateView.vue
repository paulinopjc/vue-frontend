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
        <textarea v-model="form.description" rows="3" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
      </div>
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select v-model="form.status" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400">
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-xs font-medium text-gray-600 mb-1">Priority</label>
          <select v-model="form.priority" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
        <input v-model="form.due_date" type="date" class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" />
      </div>

      <div class="flex gap-3 pt-2">
        <button type="submit" :disabled="saving" class="px-5 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
          {{ saving ? 'Creating…' : 'Create Task' }}
        </button>
        <button type="button" @click="router.push('/tasks')" class="px-5 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'

const store = useTasksStore()
const router = useRouter()
const saving = ref(false)
const error = ref('')

const form = ref({
  title: '',
  description: '',
  status: 'todo' as const,
  priority: 'medium' as const,
  due_date: '',
})

async function submit() {
  saving.value = true
  error.value = ''
  try {
    await store.createTask(form.value)
    router.push('/tasks')
  } catch {
    error.value = 'Failed to create task.'
  } finally {
    saving.value = false
  }
}
</script>
