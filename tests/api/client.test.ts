import { describe, it, expect, beforeEach } from 'vitest'
import { createApiClient } from '@/api/client'

describe('createApiClient', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates an axios instance with the given base URL', () => {
    const client = createApiClient('http://localhost:8088/api', 'task_token')
    expect(client.defaults.baseURL).toBe('http://localhost:8088/api')
  })

  it('attaches Bearer token from localStorage in request interceptor', async () => {
    localStorage.setItem('task_token', 'my_test_token')
    const client = createApiClient('http://localhost:8088/api', 'task_token')

    // Access the interceptor by simulating config transformation
    const config = { headers: {} as Record<string, string> }
    // @ts-expect-error - accessing internal interceptors for testing
    const handler = client.interceptors.request.handlers[0].fulfilled
    const result = handler(config)
    expect(result.headers['Authorization']).toBe('Bearer my_test_token')
  })
})
