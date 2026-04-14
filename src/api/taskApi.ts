import { createApiClient } from './client'
import type { AuthResponse, User, CreateUserPayload } from '@/types/auth'
import type { Task, Tag, PaginatedTasks, TaskFilters } from '@/types/task'

const TOKEN_KEY = 'task_token'
const client = createApiClient(import.meta.env.VITE_TASK_API_URL, TOKEN_KEY)

export const taskApi = {
  // Auth
  loginWithGoogle(idToken: string): Promise<{ data: { data: AuthResponse } }> {
    return client.post('/auth/google', { id_token: idToken })
  },
  me(): Promise<{ data: { data: User } }> {
    return client.get('/me')
  },
  logout(): Promise<void> {
    return client.post('/logout')
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
  createTag(name: string): Promise<{ data: { data: Tag } }> {
    return client.post('/tags', { name })
  },

  // Admin — users
  listUsers(): Promise<{ data: { data: User[] } }> {
    return client.get('/admin/users')
  },
  createUser(payload: CreateUserPayload): Promise<{ data: { data: User } }> {
    return client.post('/admin/users', payload)
  },
  updateUser(id: number, payload: Partial<CreateUserPayload>): Promise<{ data: { data: User } }> {
    return client.patch(`/admin/users/${id}`, payload)
  },
  toggleUser(id: number): Promise<{ data: { data: User } }> {
    return client.patch(`/admin/users/${id}/toggle-active`)
  },
}
