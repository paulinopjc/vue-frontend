<template>
  <div>
    <div class="flex items-center justify-between mb-5">
      <TaskFilters @change="onFilter" />
      <router-link to="/tasks/create" class="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">
        + New Task
      </router-link>
    </div>

    <LoadingSpinner v-if="store.loading && !store.tasks.length" />
    <EmptyState v-else-if="!store.loading && !store.tasks.length" message="No tasks found." />

    <div v-else class="space-y-3">
      <TaskCard
        v-for="task in store.tasks"
        :key="task.id"
        :task="task"
        @edit="(t) => router.push(`/tasks/${t.id}/edit`)"
        @delete="onDelete"
      />
    </div>

    <div v-if="hasMore" class="mt-6 text-center">
      <button @click="loadMore" :disabled="store.loading" class="px-5 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
        {{ store.loading ? 'Loading…' : 'Load more' }}
      </button>
    </div>

    <ConfirmModal
      :open="!!deleteId"
      title="Delete task"
      message="This task will be permanently deleted."
      @confirm="confirmDelete"
      @cancel="deleteId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { usePagination } from '@/composables/usePagination'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'
import type { TaskFilters as TFilters } from '@/types/task'

const store = useTasksStore()
const router = useRouter()
const { hasMore } = usePagination(store)
const deleteId = ref<number | null>(null)
let activeFilters: TFilters = {}

onMounted(() => store.fetchTasks())

function onFilter(filters: TFilters) {
  activeFilters = filters
  store.fetchTasks(filters)
}

function loadMore() {
  store.fetchTasks(activeFilters, true)
}

function onDelete(id: number) {
  deleteId.value = id
}

async function confirmDelete() {
  if (deleteId.value) {
    await store.deleteTask(deleteId.value)
    deleteId.value = null
  }
}
</script>
