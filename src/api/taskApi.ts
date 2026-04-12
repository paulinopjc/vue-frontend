import { createApiClient } from './client'
import type { AuthResponse } from '@/types/auth'
import type { Task, Tag, PaginatedTasks, TaskFilters } from '@/types/task'

const TOKEN_KEY = 'task_token'
const client = createApiClient(import.meta.env.VITE_TASK_API_URL, TOKEN_KEY)

export const taskApi = {
  // Auth
  login(email: string, password: string): Promise<{ data: AuthResponse }> {
    return client.post('/login', { email, password })
  },
  register(name: string, email: string, password: string, password_confirmation: string): Promise<{ data: AuthResponse }> {
    return client.post('/register', { name, email, password, password_confirmation })
  },

  // Tasks
  getTasks(params: TaskFilters & { cursor?: string } = {}): Promise<{ data: PaginatedTasks }> {
    return client.get('/tasks', { params })
  },
  getTask(id: number): Promise<{ data: { data: Task } }> {
    return client.get(`/tasks/${id}`)
  },
  createTask(payload: Partial<Task>): Promise<{ data: { data: Task } }> {
    return client.post('/tasks', payload)
  },
  updateTask(id: number, payload: Partial<Task>): Promise<{ data: { data: Task } }> {
    return client.put(`/tasks/${id}`, payload)
  },
  deleteTask(id: number): Promise<void> {
    return client.delete(`/tasks/${id}`)
  },

  // Tags on tasks
  addTag(taskId: number, tagIds: number[]): Promise<{ data: { data: Task } }> {
    return client.post(`/tasks/${taskId}/tags`, { tag_ids: tagIds })
  },
  removeTag(taskId: number, tagId: number): Promise<{ data: { data: Task } }> {
    return client.delete(`/tasks/${taskId}/tags/${tagId}`)
  },

  // Tags
  getTags(): Promise<{ data: { data: Tag[] } }> {
    return client.get('/tags')
  },
}
