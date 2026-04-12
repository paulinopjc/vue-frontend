<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ task.title }}</p>
        <div class="flex items-center gap-2 mt-1 flex-wrap">
          <StatusBadge :status="task.status" />
          <StatusBadge :status="task.priority" />
          <span v-if="task.assigned_to" class="text-xs text-gray-400">{{ task.assigned_to.name }}</span>
          <span v-if="task.due_date" class="text-xs text-gray-400">Due {{ task.due_date }}</span>
        </div>
        <div v-if="task.tags.length" class="flex gap-1 mt-2 flex-wrap">
          <span
            v-for="tag in task.tags"
            :key="tag.id"
            class="inline-block px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-600"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
      <div class="flex gap-2 shrink-0">
        <button @click="emit('edit', task)" class="text-xs text-indigo-600 hover:underline">Edit</button>
        <button @click="emit('delete', task.id)" class="text-xs text-red-500 hover:underline">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/shared/StatusBadge.vue'
import type { Task } from '@/types/task'

defineProps<{ task: Task }>()
const emit = defineEmits<{ edit: [task: Task]; delete: [id: number] }>()
</script>
