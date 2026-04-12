import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskApi } from '@/api/taskApi'
import type { Task, TaskFilters } from '@/types/task'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nextCursor = ref<string | null>(null)

  async function fetchTasks(filters: TaskFilters = {}, append = false) {
    loading.value = true
    error.value = null
    try {
      const params = { ...filters, ...(append && nextCursor.value ? { cursor: nextCursor.value } : {}) }
      const res = await taskApi.getTasks(params)
      if (append) {
        tasks.value.push(...res.data.data)
      } else {
        tasks.value = res.data.data
      }
      nextCursor.value = res.data.next_cursor
    } catch (e) {
      error.value = 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: Partial<Task>) {
    const res = await taskApi.createTask(payload)
    tasks.value.unshift(res.data.data)
    return res.data.data
  }

  async function updateTask(id: number, payload: Partial<Task>) {
    const res = await taskApi.updateTask(id, payload)
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx !== -1) tasks.value[idx] = res.data.data
    return res.data.data
  }

  async function deleteTask(id: number) {
    await taskApi.deleteTask(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  async function addTag(taskId: number, tagIds: number[]) {
    const res = await taskApi.addTag(taskId, tagIds)
    const idx = tasks.value.findIndex((t) => t.id === taskId)
    if (idx !== -1) tasks.value[idx] = res.data.data
  }

  async function removeTag(taskId: number, tagId: number) {
    const res = await taskApi.removeTag(taskId, tagId)
    const idx = tasks.value.findIndex((t) => t.id === taskId)
    if (idx !== -1) tasks.value[idx] = res.data.data
  }

  return { tasks, loading, error, nextCursor, fetchTasks, createTask, updateTask, deleteTask, addTag, removeTag }
})
