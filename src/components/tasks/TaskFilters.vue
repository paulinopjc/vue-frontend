<template>
  <div class="flex gap-3 flex-wrap">
    <input
      v-model="filters.search"
      type="text"
      placeholder="Search tasks…"
      class="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-indigo-400"
      @input="emit('change', { ...filters })"
    />
    <select
      v-model="filters.status"
      class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      @change="emit('change', { ...filters })"
    >
      <option value="">All statuses</option>
      <option value="todo">To Do</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
    <select
      v-model="filters.priority"
      class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
      @change="emit('change', { ...filters })"
    >
      <option value="">All priorities</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { TaskFilters } from '@/types/task'

const filters = reactive<TaskFilters>({ search: '', status: '', priority: '' })
const emit = defineEmits<{ change: [filters: TaskFilters] }>()
</script>
