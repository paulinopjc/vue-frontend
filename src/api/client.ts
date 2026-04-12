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
        const prefix = tokenKey.replace('_token', '')
        window.location.href = `/${prefix}s/login`
      }
      return Promise.reject(error)
    },
  )

  return client
}
