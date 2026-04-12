import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTaskAuthStore } from '@/stores/taskAuth'
import { taskApi } from '@/api/taskApi'

vi.mock('@/api/taskApi', () => ({
  taskApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'member', team_id: 1, is_active: true }

describe('taskAuth store', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('login sets token and user', async () => {
    vi.mocked(taskApi.login).mockResolvedValue({ data: { data: { token: 'abc123', user: mockUser } } } as never)
    const store = useTaskAuthStore()
    await store.login('alice@example.com', 'password')
    expect(store.token).toBe('abc123')
    expect(store.user?.name).toBe('Alice')
    expect(localStorage.getItem('task_token')).toBe('abc123')
  })

  it('logout clears token and user', async () => {
    vi.mocked(taskApi.login).mockResolvedValue({ data: { data: { token: 'abc123', user: mockUser } } } as never)
    const store = useTaskAuthStore()
    await store.login('alice@example.com', 'password')
    store.logout()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(localStorage.getItem('task_token')).toBeNull()
  })

  it('loadFromStorage restores token and user from localStorage', () => {
    localStorage.setItem('task_token', 'stored_token')
    localStorage.setItem('task_user', JSON.stringify(mockUser))
    const store = useTaskAuthStore()
    store.loadFromStorage()
    expect(store.token).toBe('stored_token')
    expect(store.user?.name).toBe('Alice')
  })

  it('isAuthenticated returns true when token is set', async () => {
    vi.mocked(taskApi.login).mockResolvedValue({ data: { data: { token: 'abc123', user: mockUser } } } as never)
    const store = useTaskAuthStore()
    expect(store.isAuthenticated()).toBe(false)
    await store.login('alice@example.com', 'password')
    expect(store.isAuthenticated()).toBe(true)
  })
})
