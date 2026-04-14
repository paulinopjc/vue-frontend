export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'member'
  is_active: boolean
  team_id?: number | null
}

export interface AuthResponse {
  token: string
  user: User
}

export interface CreateUserPayload {
  name: string
  email: string
  role: 'admin' | 'manager' | 'member'
  is_active: boolean
  team_id?: number | null
}
