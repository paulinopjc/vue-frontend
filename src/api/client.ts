import axios from 'axios'
import type { AxiosInstance } from 'axios'

export function createApiClient(baseURL: string, tokenKey: string): AxiosInstance {
  const client = axios.create({ baseURL })

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem(tokenKey)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(tokenKey)
        const userKey = tokenKey.replace('_token', '_user')
        localStorage.removeItem(userKey)
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    },
  )

  return client
}
